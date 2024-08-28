/* istanbul ignore file */
/*import { IWhatsAppService } from "@/common/interfaces/abstracts/whatsapp.service";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WhatsAppService implements IWhatsAppService {
   constructor(
      private readonly configService: ConfigService,
      private readonly httpService: HttpService
   ) { }

   public async sendMessage(contact: string, message: any): Promise<void> {
      const recipientWaId = this.configService.get('RECIPIENT_WAID', '');
      const data = this.getTextMessageInput(contact, 'Welcome to the Movie Ticket Demo App for Node.js!');

      return this.send(data)
   }

   private async send(data) {
      const version = this.configService.get('META_VERSION', 'v13.0');
      const phoneNumberId = this.configService.get('META_PHONE_NUMBER_ID');
      const accessToken = this.configService.get('META_ACCESS_TOKEN');
      const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

      const { data: response } = await this.httpService.axiosRef.post(url, data, {
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
         }
      });

      return response;
   }

   private getTextMessageInput(recipient, text) {
      return {
         messaging_product: "whatsapp",
         preview_url: false,
         recipient_type: "individual",
         to: recipient,
         type: "text",
         text: {
            "body": text
         }
      }
   }
}*/