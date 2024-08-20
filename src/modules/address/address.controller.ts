import { DeleteApiResponse } from '@/common/decorators/requests/deleteApiResponse.decorator';
import { PostApiResponse } from '@/common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '@/common/decorators/requests/putApiResponse.decorator';
import { UseCaseProxy } from '@/common/utils/usecase-proxy';
import { Body, Controller, HttpCode, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddressModule } from './address.module';
import { CreateAddressDTO, UpdateAddressDTO } from './presenters/address.dto';
import { AddressPresenter } from './presenters/address.presenter';
import { CreateAddressUseCase } from './use-cases/create-address.usecase';
import { DeleteAddressUseCase } from './use-cases/delete-address.usecase';
import { UpdateAddressUseCase } from './use-cases/update-address.usecase';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController {
   constructor(
      @Inject(AddressModule.CREATE_ADDRESS_USECASE)
      private readonly createAddressUseCase: UseCaseProxy<CreateAddressUseCase>,
      @Inject(AddressModule.UPDATE_ADDRESS_USECASE)
      private readonly updateAddressUseCase: UseCaseProxy<UpdateAddressUseCase>,
      @Inject(AddressModule.DELETE_ADDRESS_USECASE)
      private readonly deleteAddressUseCase: UseCaseProxy<DeleteAddressUseCase>,
   ) {}

   @PostApiResponse(AddressPresenter, '', false)
   public async createAddress(
      @Body() address: CreateAddressDTO,
   ): Promise<AddressPresenter> {
      const createdAddress = await this.createAddressUseCase
         .getInstance()
         .execute(address);

      return new AddressPresenter(createdAddress);
   }

   @PutApiResponse(AddressPresenter, '/:id')
   public async updateAddress(
      @Param('id') id: string,
      @Body() address: UpdateAddressDTO,
   ): Promise<AddressPresenter> {
      const updatedAddress = await this.updateAddressUseCase
         .getInstance()
         .execute(id, address);

      return new AddressPresenter(updatedAddress);
   }

   @HttpCode(204)
   @DeleteApiResponse('/:id')
   public async deleteAddress(
      @Param('id') id: string,
   ): Promise<AddressPresenter> {
      const deletedAddress = await this.deleteAddressUseCase
         .getInstance()
         .execute(id);

      return new AddressPresenter(deletedAddress);
   }
}
