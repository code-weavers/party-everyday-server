import { AdditionalInfoType } from '@/common/enums/additionalInfoType.enum';
import { PartyStatus } from '@/common/enums/statusParty.enum';
import { IGatewayService } from '@/common/interfaces/abstracts/gateway.service';
import { IMailService } from '@/common/interfaces/abstracts/mail.service';
import { ICheckoutRepository } from '@/common/interfaces/repositories/checkout.repository';
import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { Party } from '@/entities/party.entity';
import { CheckoutUseCase } from '@/modules/party/use-cases/checkout.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

describe('CheckoutUseCase', () => {
   let useCase: CheckoutUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;
   let checkoutRepository: ICheckoutRepository;
   let mailService: IMailService;
   let gatewayService: IGatewayService;

   beforeEach(() => {
      logger = createMock<ILogger>();
      repository = createMock<IPartyRepository>();
      checkoutRepository = createMock<ICheckoutRepository>();
      mailService = createMock<IMailService>();
      gatewayService = createMock<IGatewayService>();

      useCase = new CheckoutUseCase(logger, repository, checkoutRepository, mailService, gatewayService);
   });

   describe('execute', () => {
      it('should successfully checkout a party', async () => {
         const partyId = 'party-id';
         const party = {
            id: partyId,
            additionalInfo: [],
            guests: [{ user: { id: 'user-id', username: 'user', billingAccountKey: 'key', email: 'email' } }],
            ownerId: 'user-id',
            name: 'party-name'
         } as Party;

         jest.spyOn(repository, 'findOne').mockResolvedValue(party);
         jest.spyOn(repository, 'update').mockResolvedValue({ ...party, status: PartyStatus.CHECKED_OUT });

         const result = await useCase.execute(partyId);

         expect(repository.findOne).toHaveBeenCalledWith(partyId);
         expect(repository.update).toHaveBeenCalledWith(partyId, { status: PartyStatus.CHECKED_OUT });
         expect(gatewayService.sendNotification).toHaveBeenCalledWith({ message: 'Party checkout successfully' });
         expect(result.status).toBe(PartyStatus.CHECKED_OUT);
      });

      it('should handle errors during checkout', async () => {
         const partyId = 'party-id';

         jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Repository error'));

         await expect(useCase.execute(partyId)).rejects.toThrow('Repository error');
      });
   });

   describe('getAverageCostByGuest', () => {
      it('should return 0 if there are no additional costs', () => {
         const totalGuests = 3;
         const additionalInfo: AdditionalPartyInfo[] = [];

         const result = useCase['getAverageCostByGuest'](additionalInfo, totalGuests);

         expect(result).toBe(0);
      });

      it('should return the correct average cost per guest when there are costs', () => {
         const totalGuests = 3;
         const additionalInfo: AdditionalPartyInfo[] = [
            { name: 'test1', type: AdditionalInfoType.COST, value: 150 },
            { name: 'test2', type: AdditionalInfoType.COST, value: 300 }
         ];

         const result = useCase['getAverageCostByGuest'](additionalInfo, totalGuests);

         expect(result).toBe(150);
      });

      it('should ignore non-cost additional info', () => {
         const totalGuests = 3;
         const additionalInfo: AdditionalPartyInfo[] = [
            { name: 'test1', type: AdditionalInfoType.COST, value: 150 },
            { name: 'test2', type: AdditionalInfoType.PAYMENT, value: 300 }
         ];

         const result = useCase['getAverageCostByGuest'](additionalInfo, totalGuests);

         expect(result).toBe(50);
      });

      it('should handle division by zero when there are no guests', () => {
         const totalGuests = 0;
         const additionalInfo: AdditionalPartyInfo[] = [
            { name: 'test1', type: AdditionalInfoType.COST, value: 150 },
            { name: 'test2', type: AdditionalInfoType.COST, value: 300 }
         ];

         const result = useCase['getAverageCostByGuest'](additionalInfo, totalGuests);

         expect(result).toBe(Infinity);
      });
   });

   describe('getTotalPaymentByGuest', () => {
      it('should return 0 if there are no payments', () => {
         const userId = '1';
         const additionalInfo: AdditionalPartyInfo[] = [];

         const result = useCase['getTotalPaymentByGuest'](additionalInfo, userId);

         expect(result).toBe(0);
      });

      it('should return the correct total payment for a given user', () => {
         const userId = '1';
         const additionalInfo: AdditionalPartyInfo[] = [
            { userId: '1', name: 'test1', type: AdditionalInfoType.PAYMENT, value: 50 },
            { userId: '1', name: 'test2', type: AdditionalInfoType.PAYMENT, value: 100 }
         ];

         const result = useCase['getTotalPaymentByGuest'](additionalInfo, userId);

         expect(result).toBe(150);
      });

      it('should ignore payments from other users', () => {
         const userId = '1';
         const additionalInfo: AdditionalPartyInfo[] = [
            { userId: '1', name: 'test1', type: AdditionalInfoType.PAYMENT, value: 50 },
            { userId: '2', name: 'test2', type: AdditionalInfoType.PAYMENT, value: 100 }
         ];

         const result = useCase['getTotalPaymentByGuest'](additionalInfo, userId);

         expect(result).toBe(50);
      });

      it('should ignore non-payment additional info', () => {
         const userId = '1';
         const additionalInfo: AdditionalPartyInfo[] = [
            { userId: '1', name: 'test1', type: AdditionalInfoType.PAYMENT, value: 50 },
            { userId: '1', name: 'test2', type: AdditionalInfoType.COST, value: 100 }
         ];

         const result = useCase['getTotalPaymentByGuest'](additionalInfo, userId);

         expect(result).toBe(50);
      });
   });

   describe('checkoutParty', () => {
      it('should create checkout records for each guest', async () => {
         const party = {
            id: 'party-id',
            guests: [{ user: { id: 'user-id', username: 'user', billingAccountKey: 'key' } }],
            ownerId: 'user-id'
         } as Party;
         const totalCostByGuest = 100;
         const additionalInfo: AdditionalPartyInfo[] = [];

         await useCase['checkoutParty'](party, totalCostByGuest, additionalInfo);

         expect(checkoutRepository.create).toHaveBeenCalledWith('party-id', {
            partyId: 'party-id',
            name: 'user',
            value: 100
         });
      });
   });

   describe('sendCheckoutMessage', () => {
      it('should send checkout messages to each guest', async () => {
         const party = {
            id: 'party-id',
            guests: [{ user: { id: 'user-id', username: 'user', billingAccountKey: 'key', email: 'email' } }],
            ownerId: 'user-id',
            name: 'party-name'
         } as Party;
         const totalCostByGuest = 100;
         const additionalInfo: AdditionalPartyInfo[] = [];

         await useCase['sendCheckoutMessage'](party, totalCostByGuest, additionalInfo);

         expect(mailService.sendMail).toHaveBeenCalledWith(
            'email',
            'Checkout da festa party-name',
            expect.stringContaining('O valor do evento party-name a ser pago é de R$ 100.00'),
            'key'
         );
      });
   });
});