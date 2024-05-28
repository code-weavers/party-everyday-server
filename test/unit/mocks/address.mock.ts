import { Address } from '@/entities/address.entity';
import { CreateAddressDTO } from '@/modules/address/presenters/address.dto';
import { AddressPresenter } from '@/modules/address/presenters/address.presenter';

export const address: Address = {
   id: '1',
   name: 'Guest Party',
   street: 'Rua das Flores',
   number: 123,
   city: 'São Paulo',
   complement: 'Apto 123',
   lat: '-23.5489',
   lng: '-46.6388',
   neighborhood: 'Vila Madalena',
   state: 'SP',
   zipCode: '05434-000',
};

export const addressList: Address[] = [address];

export const createAddressDTO: CreateAddressDTO = {
   name: 'Guest Party',
   city: 'São Paulo',
   lat: '-23.5489',
   lng: '-46.6388',
   complement: 'Apto 123',
   number: 123,
   state: 'SP',
   street: 'Rua das Flores',
   zipCode: '05434-000',
   neighborhood: 'Vila Madalena',
};

export const updateAddressDTO: CreateAddressDTO = {
   name: 'Guest Party',
   city: 'São Paulo',
   lat: '-23.5489',
   lng: '-46.6388',
   complement: 'Apto 123',
   number: 123,
   state: 'SP',
   street: 'Rua das Flores',
   zipCode: '05434-000',
   neighborhood: 'Vila Madalena',
};

export const addressPresenter: AddressPresenter = {
   id: '1',
   name: 'Guest Party',
   street: 'Rua das Flores',
   number: 123,
   city: 'São Paulo',
   complement: 'Apto 123',
   lat: '-23.5489',
   lng: '-46.6388',
   neighborhood: 'Vila Madalena',
   state: 'SP',
   zipCode: '05434-000',
};
