import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { Address } from '@/entities/address.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDTO, UpdateAddressDTO } from './presenters/address.dto';

@Injectable()
export class AddressRepository implements IAddressRepository {
   constructor(
      @InjectRepository(Address)
      private readonly repository: Repository<Address>,
   ) {}

   public async findAll(): Promise<Address[]> {
      return await this.repository.find();
   }

   public async findById(id: string): Promise<Address> {
      return await this.repository.findOne({ where: { id } });
   }

   public async create(address: CreateAddressDTO): Promise<Address> {
      return await this.repository.save(address);
   }

   public async update(
      id: string,
      address: UpdateAddressDTO,
   ): Promise<Address> {
      return await this.repository.save({ id, ...address });
   }

   public async delete(id: string): Promise<Address> {
      const address = await this.repository.findOne({ where: { id } });

      if (address) {
         this.repository.delete(id);
         return address;
      }
   }
}
