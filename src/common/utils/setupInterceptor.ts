import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class SetupInterceptor {
   static for(app: INestApplication) {
      app.useGlobalInterceptors(
         new ClassSerializerInterceptor(app.get(Reflector)),
      );
   }
}
