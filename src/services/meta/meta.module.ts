import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
   imports: [
      ConfigModule.forRoot(),
      HttpModule
   ],
   //providers: [WhatsAppService],
   //exports: [WhatsAppService],
})
export class MetaModule { }
