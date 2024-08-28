import { NestFactory } from '@nestjs/core';
import { connect } from '@ngrok/ngrok';
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

   connect({ addr: port, authtoken_from_env: true }).then((listener) =>
      console.log(`Ingress established at: ${listener.url()}`),
   );

   console.log(`Process Id: ${process.pid}`);
}
server();
