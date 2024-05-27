import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupInterceptor } from './common/utils/setupInterceptor';
import { SetupPipe } from './common/utils/setupPipe';
import { SetupSwagger } from './common/utils/setupSwagger';

async function server() {
   const port = process.env.PORT || 3010;
   const app = await NestFactory.create(AppModule, {
      cors: true,
   });

   SetupInterceptor.for(app);

   SetupPipe.for(app);

   SetupSwagger.for(app);

   await app.listen(port);
}
server();
