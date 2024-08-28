import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppService } from './whatsapp/whatsapp.service';

@Module({
   imports: [
      ConfigModule.forRoot(),
      HttpModule
   ],
   providers: [WhatsAppService],
   exports: [WhatsAppService],
})
export class MetaModule { }
