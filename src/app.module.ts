import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { CustomHttpException } from './common/filters/httpException.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformResponseInterceptor } from './common/interceptors/transformResponse.interceptor';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { LocalStrategy } from './common/strategies/local.strategy';
import { LoggerModule } from './config/logger/logger.module';
import { ControllersModule } from './modules/controllers.proxy.module';
import { BcryptModule } from './services/bcrypt/bcrypt.module';
import { JwtModule } from './services/jwt/jwt.module';

@Module({
   imports: [
      PassportModule,
      LoggerModule,
      JwtModule,
      BcryptModule,
      ControllersModule,
   ],
   providers: [
      LocalStrategy,
      JwtStrategy,
      {
         provide: 'EXCEPTION_FILTER',
         useClass: CustomHttpException,
      },
      {
         provide: 'APP_INTERCEPTOR',
         useClass: ClassSerializerInterceptor,
      },
      {
         provide: 'APP_INTERCEPTOR',
         useClass: TransformResponseInterceptor,
      },
      {
         provide: APP_GUARD,
         useClass: JwtAuthGuard,
      },
   ],
})
export class AppModule {}
