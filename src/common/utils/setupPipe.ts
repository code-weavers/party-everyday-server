import { INestApplication, ValidationPipe } from '@nestjs/common';

export class SetupPipe {
   static for(app: INestApplication) {
      app.useGlobalPipes(
         new ValidationPipe({
            transform: true,
         }),
      );
   }
}
