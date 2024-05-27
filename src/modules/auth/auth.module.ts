import { LoggerModule } from '@config/logger/logger.module';
import { LoggerService } from '@config/logger/logger.service';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { JwtModule } from '../../services/jwt/jwt.module';
import { JwtTokenService } from '../../services/jwt/jwt.service';
import { RepositoriesModule } from '../repositories.proxy.module';
import { UserRepository } from '../user/user.repository';
import { LoginUseCase } from './use-cases/login.usecase';

@Module({
   imports: [
      LoggerModule,
      EnvironmentConfigModule,
      RepositoriesModule,
      BcryptModule,
      JwtModule,
   ],
})
export class AuthModule {
   static LOGIN_USECASES_PROXY = 'login';

   static register(): DynamicModule {
      return {
         module: AuthModule,
         providers: [
            {
               inject: [
                  LoggerService,
                  JwtTokenService,
                  BcryptService,
                  UserRepository,
               ],
               provide: AuthModule.LOGIN_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  jwtService: JwtTokenService,
                  bcryptService: BcryptService,
                  userRepository: UserRepository,
               ) =>
                  new UseCaseProxy(
                     new LoginUseCase(
                        logger,
                        jwtService,
                        bcryptService,
                        userRepository,
                     ),
                  ),
            },
         ],
         exports: [AuthModule.LOGIN_USECASES_PROXY],
      };
   }
}
