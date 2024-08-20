import { PartyStatus } from '@/common/enums/statusParty.enum';
import { Party } from '@/entities/party.entity';
import {
   CreatePartyDTO,
   UpdatePartyDTO,
} from '@/modules/party/presenters/party.dto';
import { additionalInfosMock } from './additionalInfo.mock';
import { guestsMock } from './guest.mock';

export const partyMock: Party = {
   id: '1',
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   status: PartyStatus.ACTIVE,
   addressId: '1',
   address: {
      id: '1',
      name: 'My Address',
      street: 'My Street',
      number: 123,
      neighborhood: 'My Neighborhood',
      city: 'My City',
      state: 'My State',
      lat: '-23.123456',
      lng: '-46.123456',
      zipCode: '12345',
   },
   guests: guestsMock,
   files: [],
};

export const partyWithoutGuests: Party = {
   id: '1',
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   status: PartyStatus.ACTIVE,
   addressId: '1',
   address: {
      id: '1',
      name: 'My Address',
      street: 'My Street',
      number: 123,
      neighborhood: 'My Neighborhood',
      city: 'My City',
      state: 'My State',
      lat: '-23.123456',
      lng: '-46.123456',
      zipCode: '12345',
   },
   guests: [],
   files: [],
};

export const partyWithAdditionalInfoMock: Party = {
   id: '1',
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   status: PartyStatus.ACTIVE,
   addressId: '1',
   address: {
      id: '1',
      name: 'My Address',
      street: 'My Street',
      number: 123,
      neighborhood: 'My Neighborhood',
      city: 'My City',
      state: 'My State',
      lat: '-23.123456',
      lng: '-46.123456',
      zipCode: '12345',
   },
   additionalInfo: additionalInfosMock,
   guests: [],
   files: [],
};

export const partyList: Party[] = [partyMock];

export const createPartyDTO: CreatePartyDTO = {
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   addressId: '1',
   address: {
      name: 'My Address',
      street: 'My Street',
      number: 123,
      neighborhood: 'My Neighborhood',
      city: 'My City',
      state: 'My State',
      lat: '-23.123456',
      lng: '-46.123456',
      zipCode: '12345',
   },
   guests: [
      {
         id: '1',
      },
      {
         id: '2',
      },
   ],
};

export const createPartyDTOWithoutGuests: CreatePartyDTO = {
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   addressId: '1',
   address: {
      id: '1',
      name: 'My Address',
      street: 'My Street',
      number: 123,
      neighborhood: 'My Neighborhood',
      city: 'My City',
      state: 'My State',
      lat: '-23.123456',
      lng: '-46.123456',
      zipCode: '12345',
   },
};

export const updatePartyDTO: UpdatePartyDTO = {
   name: 'My Party Updated',
   description: 'My Party Description Updated',
   date: new Date(),
   addressId: '1',
};

export const partyUpdated: Party = {
   name: 'My Party Updated',
   description: 'My Party Description Updated',
   date: new Date(),
   addressId: '1',
};
