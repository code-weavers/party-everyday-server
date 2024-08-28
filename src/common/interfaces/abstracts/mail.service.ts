export interface IMailService {
   sendMail(to: string, subject: string, message: string, key: any): Promise<void>;
}