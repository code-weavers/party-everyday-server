import { LoggerModule } from '@config/logger/logger.module';
import { LoggerService } from '@config/logger/logger.service';
import { DynamicModule, Module } from '@nestjs/common';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { RepositoriesModule } from '../repositories.proxy.module';
import { AddressRepository } from './address.repository';
import { CreateAddressUseCase } from './use-cases/create-address.usecase';
import { DeleteAddressUseCase } from './use-cases/delete-address.usecase';
import { UpdateAddressUseCase } from './use-cases/update-address.usecase';

@Module({
   imports: [LoggerModule, RepositoriesModule],
})
export class AddressModule {
   static CREATE_ADDRESS_USECASE = 'createAddressUsecase';
   static UPDATE_ADDRESS_USECASE = 'updateAddressUsecase';
   static DELETE_ADDRESS_USECASE = 'deleteAddressUsecase';

   static register(): DynamicModule {
      return {
         module: AddressModule,
         providers: [
            {
               inject: [AddressRepository, LoggerService],
               provide: AddressModule.CREATE_ADDRESS_USECASE,
               useFactory: (
                  repository: AddressRepository,
                  logger: LoggerService,
               ) =>
                  new UseCaseProxy(
                     new CreateAddressUseCase(repository, logger),
                  ),
            },
            {
               inject: [AddressRepository, LoggerService],
               provide: AddressModule.UPDATE_ADDRESS_USECASE,
               useFactory: (
                  repository: AddressRepository,
                  logger: LoggerService,
               ) =>
                  new UseCaseProxy(
                     new UpdateAddressUseCase(repository, logger),
                  ),
            },
            {
               inject: [AddressRepository, LoggerService],
               provide: AddressModule.DELETE_ADDRESS_USECASE,
               useFactory: (
                  repository: AddressRepository,
                  logger: LoggerService,
               ) =>
                  new UseCaseProxy(
                     new DeleteAddressUseCase(repository, logger),
                  ),
            },
         ],
         exports: [
            AddressModule.CREATE_ADDRESS_USECASE,
            AddressModule.UPDATE_ADDRESS_USECASE,
            AddressModule.DELETE_ADDRESS_USECASE,
         ],
      };
   }
}
