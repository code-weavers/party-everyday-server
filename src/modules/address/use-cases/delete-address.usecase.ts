import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { Address } from '@/entities/address.entity';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DeleteAddressUseCase {
   constructor(
      private readonly repository: IAddressRepository,
      private readonly logger: ILogger,
   ) {}

   public async execute(id: string): Promise<Address> {
      const addressDeleted = await this.repository.delete(id);

      if (addressDeleted) {
         this.logger.log(
            'DeleteAddressUseCase execute()',
            `Address ${id} have been deleted`,
         );

         return addressDeleted;
      } else {
         throw new NotFoundException({
            message: 'Address not found!',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   }
}
