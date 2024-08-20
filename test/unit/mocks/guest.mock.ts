import { GuestStatus } from "@/common/enums/guest.enum";
import { Guest } from "@/entities/guest.entity";
import { AddGuestDTO } from "@/modules/party/presenters/party.dto";

export const createGuestMock: AddGuestDTO = {
   guests: ['1', '2', '3'],
}

export const guestMock: Guest = {
   id: '1',
   userId: '1',
   partyId: '1',
   status: GuestStatus.ACCEPTED,
   user: {
      id: '1',
      username: 'johndoe',
      email: 'teste@teste.com',
      password: 'hashedPassword',
      telephoneNumber: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
}

export const guestsMock: Guest[] = [
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
         telephoneNumber: '123456789',
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
         telephoneNumber: '123456789',
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
         telephoneNumber: '123456789',
         createdAt: new Date(),
         updatedAt: new Date(),
      },
   },
];