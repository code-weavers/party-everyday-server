import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NodemailerService } from "./nodemailer.service";

@Module({
   imports: [
      ConfigModule.forRoot(),
      MailerModule.forRoot({
         transport: {
            host: String(process.env.MAIL_HOST),
            secure: false,
            port: Number(process.env.MAIL_PORT), // porta
            auth: {
               user: String(process.env.MAIL_USER),
               pass: String(process.env.MAIL_PASS),
            },
            ignoreTLS: true,
         },
      }),
   ],
   providers: [NodemailerService],
   exports: [NodemailerService],
})
export class MailModule { }