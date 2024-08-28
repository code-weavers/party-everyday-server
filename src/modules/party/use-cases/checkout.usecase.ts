import { PartyStatus } from '@/common/enums/statusParty.enum';
import { IGatewayService } from '@/common/interfaces/abstracts/gateway.service';
import { IMailService } from '@/common/interfaces/abstracts/mail.service';
import { ICheckoutRepository } from '@/common/interfaces/repositories/checkout.repository';
import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { Party } from '@/entities/party.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class CheckoutUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
      private readonly checkoutRepository: ICheckoutRepository,
      private readonly mailService: IMailService,
      private readonly gatewayService: IGatewayService,
   ) { }

   public async execute(partyId: string): Promise<Party> {
      this.logger.log(' CheckoutUseCase execute()', `Start checkout party with params (partyId): ${JSON.stringify(partyId)}`)

      const party = await this.repository.findOne(partyId);

      const costByGuest = await this.getAverageCostByGuest(party.additionalInfo, party.guests.length);

      await this.checkoutParty(party, costByGuest, party.additionalInfo);

      const updatedParty = await this.repository.update(partyId, { status: PartyStatus.CHECKED_OUT });

      this.gatewayService.sendNotification({ message: 'Party checkout successfully' });

      this.logger.log(
         'CheckoutUseCase execute()',
         'Party checkout successfully',
      );

      return updatedParty;
   }

   private getAverageCostByGuest(additionalInfo: AdditionalPartyInfo[], totalGuests: number): number {
      const totalCosts = additionalInfo.reduce((sum, info) => {
         return info.type === 'COST' ? sum + info.value : sum;
      }, 0);

      return totalCosts / totalGuests;
   }

   private getTotalPaymentByGuest(additionalInfo: AdditionalPartyInfo[], userId: string): number {
      return additionalInfo.reduce((sum, info) => {
         return info.userId === userId && info.type === 'PAYMENT' ? sum + info.value : sum;
      }, 0);
   }

   private async checkoutParty(party: Party, totalCostByGuest: number, additionalInfo: AdditionalPartyInfo[]): Promise<void> {
      const promises = [];

      for (const guest of party.guests) {
         let chavePix: string;
         const user = guest.user;

         if (user.id === party.ownerId) {
            chavePix = user.billingAccountKey;
         }

         const totalPayment = this.getTotalPaymentByGuest(additionalInfo, user.id);
         const remainingPayment = totalCostByGuest - totalPayment;

         const checkout = {
            partyId: party.id,
            name: user.username,
            value: Number(remainingPayment.toFixed(2)),
         }

         promises.push(this.checkoutRepository.create(party.id, checkout))
      }

      await Promise.all(promises);
   }

   private async sendCheckoutMessage(party: Party, totalCostByGuest: number, additionalInfo: AdditionalPartyInfo[]): Promise<void> {
      //const promises = [];

      for (const guest of party.guests) {
         const user = guest.user;
         let qrCode = '';

         if (user.id === party.ownerId) {
            qrCode = user.billingAccountKey;
         }

         const totalPayment = this.getTotalPaymentByGuest(additionalInfo, user.id);
         const remainingPayment = totalCostByGuest - totalPayment;

         const message = `Olá, ${guest.user.username}! O valor do evento ${party.name} a ser pago é de R$ ${remainingPayment.toFixed(2)}. Para realizar o pagamento, entre no aplicativo do banco de sua preferência e cole a chave PIX abaixo: <br><br> ${qrCode}`;
         const subject = `Checkout da festa ${party.name}`;

         this.mailService.sendMail(user.email, subject, message, qrCode)
      }


      //Promise.all(promises);
   }

   /*private getAndFormatQRCode(billingCode): string {
      const QRCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${billingCode}`;
      const QRCodeContent = `<img src="${QRCode}" alt="QR Code" />`;

      return `<div style="text-align: center;">${QRCodeContent}</div>`;
   }*/
}