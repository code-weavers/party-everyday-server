import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SetupSwagger {
   static for(app: INestApplication) {
      const config = new DocumentBuilder()
         .setTitle('Template API')
         .setDescription(
            'The Template API development with NestJS and using TypeORM for database connection.',
         )
         .setVersion('1.0')
         .addTag('Authentication')
         .addTag('Users')
         .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
   }
}
