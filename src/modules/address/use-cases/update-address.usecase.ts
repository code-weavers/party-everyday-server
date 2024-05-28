import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { Address } from '@/entities/address.entity';
import { Injectable } from '@nestjs/common';
import { UpdateAddressDTO } from '../presenters/address.dto';

@Injectable()
export class UpdateAddressUseCase {
   constructor(
      private readonly repository: IAddressRepository,
      private readonly logger: ILogger,
   ) {}

   public async execute(
      id: string,
      address: UpdateAddressDTO,
   ): Promise<Address> {
      const updatedAddress = await this.repository.update(id, address);

      this.logger.log(
         'UpdateAddressUseCase execute()',
         `Address ${updatedAddress.street}, ${updatedAddress.number} - ${updatedAddress.city} - ${updatedAddress.state} have been updated`,
      );

      return updatedAddress;
   }
}
