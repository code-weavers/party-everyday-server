import { GuestStatus } from '@/common/enums/guest.enum';
import { PartyStatus } from '@/common/enums/statusParty.enum';
import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import {
   CreatePartyDTO,
   UpdatePartyDTO,
} from '@/modules/party/presenters/party.dto';

const guests: Guest[] = [
   {
      id: '1',
      userId: '1',
      partyId: '1',
      status: GuestStatus.ACCEPTED,
      user: {
         id: '1',
         username: 'johndoe',
         email: 'teste@teste.com',
         password: 'hashedPassword',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   },
   {
      id: '2',
      userId: '2',
      partyId: '1',
      status: GuestStatus.PENDING,
      user: {
         id: '1',
         username: 'marydoe',
         email: 'teste@teste.com',
         password: 'hashedPassword',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   },
   {
      id: '2',
      userId: '2',
      partyId: '1',
      status: GuestStatus.PENDING,
      user: {
         id: '1',
         username: 'joedoe',
         email: 'teste@teste.com',
         password: 'hashedPassword',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   },
];

export const party: Party = {
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
   guests: guests,
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

export const partyList: Party[] = [party];

export const createPartyDTO: CreatePartyDTO = {
   ownerId: '1',
   name: 'My Party',
   description: 'My Party Description',
   date: new Date(),
   addressId: '1',
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
