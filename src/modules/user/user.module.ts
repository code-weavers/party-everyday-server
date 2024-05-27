import { CacheConfigModule } from '@/services/redis/cache.module';
import { CacheService } from '@/services/redis/cache.service';
import { EnvironmentConfigModule } from '@config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@config/environment-config/environment-config.service';
import { LoggerModule } from '@config/logger/logger.module';
import { LoggerService } from '@config/logger/logger.service';
import { DynamicModule, Module } from '@nestjs/common';
import { BcryptModule } from '@services/bcrypt/bcrypt.module';
import { BcryptService } from '@services/bcrypt/bcrypt.service';
import { JwtModule } from '@services/jwt/jwt.module';
import { JwtTokenService } from '@services/jwt/jwt.service';
import { S3Module } from '@services/s3/s3.module';
import { S3Service } from '@services/s3/s3.service';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { FileRepository } from '../file/file.repository';
import { RepositoriesModule } from '../repositories.proxy.module';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUserUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { FindUserByKeyUseCase } from './use-cases/find-user-by-key.usecase';
import { UpdateUserFileUseCase } from './use-cases/update-user-file.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { UserRepository } from './user.repository';

@Module({
   imports: [
      LoggerModule,
      EnvironmentConfigModule,
      RepositoriesModule,
      BcryptModule,
      CacheConfigModule,
      JwtModule,
      S3Module,
   ],
})
export class UserModule {
   static GET_USER_USECASES_PROXY = 'getUserUsecasesProxy';
   static GET_USERS_USECASES_PROXY = 'getUsersUsecasesProxy';
   static FIND_USER_BY_KEY_USECASES_PROXY = 'findUserByKeyUsecasesProxy';
   static CREATE_USER_USECASES_PROXY = 'postUserUsecasesProxy';
   static UPDATE_USER_USECASES_PROXY = 'putUserUsecasesProxy';
   static UPDATE_USER_FILE_USECASES_PROXY = 'putUserFileUsecasesProxy';
   static DELETE_USER_USECASES_PROXY = 'deleteUserUsecasesProxy';

   static register(): DynamicModule {
      return {
         module: UserModule,
         providers: [
            {
               inject: [UserRepository, CacheService],
               provide: UserModule.GET_USERS_USECASES_PROXY,
               useFactory: (
                  repository: UserRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindAllUserUseCase(repository, cacheService),
                  ),
            },
            {
               inject: [UserRepository, CacheService],
               provide: UserModule.GET_USER_USECASES_PROXY,
               useFactory: (
                  repository: UserRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindOneUserUseCase(repository, cacheService),
                  ),
            },
            {
               inject: [UserRepository, CacheService],
               provide: UserModule.FIND_USER_BY_KEY_USECASES_PROXY,
               useFactory: (repository: UserRepository) =>
                  new UseCaseProxy(new FindUserByKeyUseCase(repository)),
            },
            {
               inject: [
                  LoggerService,
                  UserRepository,
                  FileRepository,
                  BcryptService,
                  JwtTokenService,
                  S3Service,
                  EnvironmentConfigService,
               ],
               provide: UserModule.CREATE_USER_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: UserRepository,
                  fileRepository: FileRepository,
                  bcryptService: BcryptService,
                  jwtService: JwtTokenService,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
               ) =>
                  new UseCaseProxy(
                     new CreateUserUseCase(
                        logger,
                        repository,
                        fileRepository,
                        bcryptService,
                        jwtService,
                        s3Service,
                        config,
                     ),
                  ),
            },
            {
               inject: [LoggerService, UserRepository, BcryptService],
               provide: UserModule.UPDATE_USER_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: UserRepository,
                  bcryptService: BcryptService,
               ) =>
                  new UseCaseProxy(
                     new UpdateUserUseCase(logger, repository, bcryptService),
                  ),
            },
            {
               inject: [
                  LoggerService,
                  UserRepository,
                  FileRepository,
                  S3Service,
                  EnvironmentConfigService,
               ],
               provide: UserModule.UPDATE_USER_FILE_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: UserRepository,
                  fileRepository: FileRepository,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
               ) =>
                  new UseCaseProxy(
                     new UpdateUserFileUseCase(
                        logger,
                        repository,
                        fileRepository,
                        s3Service,
                        config,
                     ),
                  ),
            },
            {
               inject: [
                  LoggerService,
                  UserRepository,
                  S3Service,
                  EnvironmentConfigService,
                  FileRepository,
               ],
               provide: UserModule.DELETE_USER_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: UserRepository,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
                  fileRepository: FileRepository,
               ) =>
                  new UseCaseProxy(
                     new DeleteUserUseCase(
                        logger,
                        repository,
                        s3Service,
                        config,
                        fileRepository,
                     ),
                  ),
            },
         ],
         exports: [
            UserModule.GET_USERS_USECASES_PROXY,
            UserModule.GET_USER_USECASES_PROXY,
            UserModule.FIND_USER_BY_KEY_USECASES_PROXY,
            UserModule.CREATE_USER_USECASES_PROXY,
            UserModule.UPDATE_USER_USECASES_PROXY,
            UserModule.UPDATE_USER_FILE_USECASES_PROXY,
            UserModule.DELETE_USER_USECASES_PROXY,
         ],
      };
   }
}
