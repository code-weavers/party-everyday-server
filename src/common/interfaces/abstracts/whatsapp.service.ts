export interface IWhatsAppService {
   sendMessage(contact: string, message: any): Promise<void>;
}