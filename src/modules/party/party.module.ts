import { GatewayModule } from '@/services/gateway/gateway.module';
import { GatewayService } from '@/services/gateway/gateway.service';
import { MailModule } from '@/services/mail/mail.module';
import { NodemailerService } from '@/services/mail/nodemailer.service';
import { CacheConfigModule } from '@/services/redis/cache.module';
import { CacheService } from '@/services/redis/cache.service';
import { EnvironmentConfigModule } from '@config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@config/environment-config/environment-config.service';
import { LoggerModule } from '@config/logger/logger.module';
import { LoggerService } from '@config/logger/logger.service';
import { DynamicModule, Module } from '@nestjs/common';
import { BcryptModule } from '@services/bcrypt/bcrypt.module';
import { JwtModule } from '@services/jwt/jwt.module';
import { S3Module } from '@services/s3/s3.module';
import { S3Service } from '@services/s3/s3.service';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { AddressRepository } from '../address/address.repository';
import { CheckoutRepository } from '../checkout/checkout.repository';
import { FileRepository } from '../file/file.repository';
import { RepositoriesModule } from '../repositories.proxy.module';
import { UserRepository } from '../user/user.repository';
import { PartyRepository } from './party.repository';
import { AddGuestsUseCase } from './use-cases/add-guests.usecase';
import { CheckoutUseCase } from './use-cases/checkout.usecase';
import { CreateAdditionalInfoUseCase } from './use-cases/create-additional-info.usecase';
import { CreatePartyUseCase } from './use-cases/create-party.usecase';
import { DeleteAdditionalInfoUseCase } from './use-cases/delete-additional-info.usecase';
import { DeletePartyUseCase } from './use-cases/delete-party.usecase';
import { FindAllGuestPartiesUseCase } from './use-cases/find-all-invited-parties.usecase';
import { FindAllOwnerPartiesUseCase } from './use-cases/find-all-owner-parties.usecase';
import { FindAllPartyUseCase } from './use-cases/find-all-party.usecase';
import { FindOnePartyUseCase } from './use-cases/find-one-party.usecase';
import { RemoveGuestUseCase } from './use-cases/remove-guest.usecase';
import { UpdatePartyFileUseCase } from './use-cases/update-party-file.usecase';
import { UpdatePartyUseCase } from './use-cases/update-party.usecase';

@Module({
   imports: [
      LoggerModule,
      EnvironmentConfigModule,
      RepositoriesModule,
      BcryptModule,
      CacheConfigModule,
      JwtModule,
      S3Module,
      MailModule,
      GatewayModule,
   ],
})
export class PartyModule {
   static FIND_PARTY_USECASES_PROXY = 'getPartyUsecasesProxy';
   static FIND_ALL_PARTIES_USECASES_PROXY = 'getPartiesUsecasesProxy';
   static FIND_ALL_OWNER_PARTIES_USECASES_PROXY =
      'getOwnerPartiesUsecasesProxy';
   static FIND_ALL_GUEST_PARTIES_USECASES_PROXY =
      'findAllGuestPartiesUsecasesProxy';
   static CREATE_PARTY_USECASES_PROXY = 'postPartyUsecasesProxy';
   static UPDATE_PARTY_USECASES_PROXY = 'putPartyUsecasesProxy';
   static UPDATE_PARTY_FILES_USECASES_PROXY = 'putPartyFileUsecasesProxy';
   static DELETE_PARTY_USECASES_PROXY = 'deletePartyUsecasesProxy';
   static CREATE_ADDITIONAL_INFO_USECASES_PROXY = 'createAdditionalInfoUsecasesProxy';
   static DELETE_ADDITIONAL_INFO_USECASES_PROXY = 'deleteAdditionalInfoUsecasesProxy';
   static ADD_GUEST_USECASES_PROXY = 'addGuestUsecasesProxy';
   static REMOVE_GUEST_USECASES_PROXY = 'removeGuestUsecasesProxy';
   static CHECKOUT_PARTY_USECASES_PROXY = 'checkoutPartyUsecasesProxy';

   static register(): DynamicModule {
      return {
         module: PartyModule,
         providers: [
            {
               inject: [PartyRepository, CacheService],
               provide: PartyModule.FIND_ALL_PARTIES_USECASES_PROXY,
               useFactory: (
                  repository: PartyRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindAllPartyUseCase(repository, cacheService),
                  ),
            },
            {
               inject: [PartyRepository, CacheService],
               provide: PartyModule.FIND_ALL_OWNER_PARTIES_USECASES_PROXY,
               useFactory: (
                  repository: PartyRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindAllOwnerPartiesUseCase(repository, cacheService),
                  ),
            },
            {
               inject: [PartyRepository, CacheService],
               provide: PartyModule.FIND_ALL_GUEST_PARTIES_USECASES_PROXY,
               useFactory: (
                  repository: PartyRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindAllGuestPartiesUseCase(repository, cacheService),
                  ),
            },
            {
               inject: [PartyRepository, CheckoutRepository, CacheService],
               provide: PartyModule.FIND_PARTY_USECASES_PROXY,
               useFactory: (
                  repository: PartyRepository,
                  checkoutRepository: CheckoutRepository,
                  cacheService: CacheService,
               ) =>
                  new UseCaseProxy(
                     new FindOnePartyUseCase(repository, checkoutRepository, cacheService),
                  ),
            },
            {
               inject: [
                  LoggerService,
                  PartyRepository,
                  FileRepository,
                  AddressRepository,
                  UserRepository,
                  S3Service,
                  EnvironmentConfigService,
                  GatewayService,
               ],
               provide: PartyModule.CREATE_PARTY_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
                  fileRepository: FileRepository,
                  addressRepository: AddressRepository,
                  userRepository: UserRepository,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
                  gatewayService: GatewayService,
               ) =>
                  new UseCaseProxy(
                     new CreatePartyUseCase(
                        logger,
                        repository,
                        fileRepository,
                        addressRepository,
                        userRepository,
                        s3Service,
                        config,
                        gatewayService,
                     ),
                  ),
            },
            {
               inject: [LoggerService, PartyRepository],
               provide: PartyModule.UPDATE_PARTY_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
               ) =>
                  new UseCaseProxy(new UpdatePartyUseCase(logger, repository)),
            },
            {
               inject: [
                  LoggerService,
                  PartyRepository,
                  FileRepository,
                  S3Service,
                  EnvironmentConfigService,
               ],
               provide: PartyModule.UPDATE_PARTY_FILES_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
                  fileRepository: FileRepository,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
               ) =>
                  new UseCaseProxy(
                     new UpdatePartyFileUseCase(
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
                  PartyRepository,
                  S3Service,
                  EnvironmentConfigService,
                  FileRepository,
               ],
               provide: PartyModule.DELETE_PARTY_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
                  s3Service: S3Service,
                  config: EnvironmentConfigService,
                  fileRepository: FileRepository,
               ) =>
                  new UseCaseProxy(
                     new DeletePartyUseCase(
                        logger,
                        repository,
                        s3Service,
                        fileRepository,
                        config,
                     ),
                  ),
            },
            {
               inject: [LoggerService, PartyRepository],
               provide: PartyModule.CREATE_ADDITIONAL_INFO_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
               ) =>
                  new UseCaseProxy(
                     new CreateAdditionalInfoUseCase(logger, repository),
                  ),
            },
            {
               inject: [LoggerService, PartyRepository],
               provide: PartyModule.DELETE_ADDITIONAL_INFO_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
               ) =>
                  new UseCaseProxy(
                     new DeleteAdditionalInfoUseCase(logger, repository),
                  ),
            },
            {
               inject: [LoggerService, PartyRepository],
               provide: PartyModule.ADD_GUEST_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
               ) =>
                  new UseCaseProxy(
                     new AddGuestsUseCase(logger, repository),
                  ),
            },
            {
               inject: [LoggerService, PartyRepository],
               provide: PartyModule.REMOVE_GUEST_USECASES_PROXY,
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
               ) =>
                  new UseCaseProxy(
                     new RemoveGuestUseCase(logger, repository),
                  ),
            },
            {
               provide: PartyModule.CHECKOUT_PARTY_USECASES_PROXY,
               inject: [LoggerService, PartyRepository, CheckoutRepository, NodemailerService, GatewayService],
               useFactory: (
                  logger: LoggerService,
                  repository: PartyRepository,
                  checkoutRepository: CheckoutRepository,
                  mailService: NodemailerService,
                  gatewayService: any,
               ) =>
                  new UseCaseProxy(
                     new CheckoutUseCase(logger, repository, checkoutRepository, mailService, gatewayService),
                  ),
            }
         ],
         exports: [
            PartyModule.FIND_ALL_PARTIES_USECASES_PROXY,
            PartyModule.FIND_ALL_OWNER_PARTIES_USECASES_PROXY,
            PartyModule.FIND_ALL_GUEST_PARTIES_USECASES_PROXY,
            PartyModule.FIND_PARTY_USECASES_PROXY,
            PartyModule.CREATE_PARTY_USECASES_PROXY,
            PartyModule.UPDATE_PARTY_USECASES_PROXY,
            PartyModule.UPDATE_PARTY_FILES_USECASES_PROXY,
            PartyModule.DELETE_PARTY_USECASES_PROXY,
            PartyModule.CREATE_ADDITIONAL_INFO_USECASES_PROXY,
            PartyModule.DELETE_ADDITIONAL_INFO_USECASES_PROXY,
            PartyModule.ADD_GUEST_USECASES_PROXY,
            PartyModule.REMOVE_GUEST_USECASES_PROXY,
            PartyModule.CHECKOUT_PARTY_USECASES_PROXY,
         ],
      };
   }
}
