import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { Address } from '@/entities/address.entity';
import { Injectable } from '@nestjs/common';
import { CreateAddressDTO } from '../presenters/address.dto';

@Injectable()
export class CreateAddressUseCase {
  constructor(
    private readonly repository: IAddressRepository,
    private readonly logger: ILogger,
  ) {}

  public async execute(address: CreateAddressDTO): Promise<Address> {
    const createdAddress = await this.repository.create(address);

    this.logger.log(
      'CreateAddressUseCase execute()',
      `New address ${createdAddress.street}, ${createdAddress.number} - ${createdAddress.city} - ${createdAddress.state} have been inserted`,
    );

    return createdAddress;
  }
}
