import { Address } from '@/entities/address.entity';
import {
   CreateAddressDTO,
   UpdateAddressDTO,
} from '@/modules/address/presenters/address.dto';

export interface IAddressRepository {
   findAll(): Promise<Address[]>;
   findById(id: string): Promise<Address>;
   create(address: CreateAddressDTO): Promise<Address>;
   update(id: string, address: UpdateAddressDTO): Promise<Address>;
   delete(id: string): Promise<Address>;
}
