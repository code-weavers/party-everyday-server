import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import { PartyRepository } from '@/modules/party/party.repository';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { additionalInfoMock, createAdditionalInfoMock } from '../../mocks/additionalInfo.mock';
import { createGuestMock, guestMock } from '../../mocks/guest.mock';
import {
   createPartyDTO,
   createPartyDTOWithoutGuests,
   partyList,
   partyMock,
   partyUpdated,
   partyWithAdditionalInfoMock,
   partyWithoutGuests,
   updatePartyDTO,
} from '../../mocks/party.mock';

describe('PartyRepository', () => {
   let partyRepository: PartyRepository;
   let repository: Repository<Party>;
   let guestRepository: Repository<Guest>;
   let additionalInfo: Repository<AdditionalPartyInfo>;

   beforeEach(() => {
      repository = createMock<Repository<Party>>({
         find: jest.fn(),
         findOne: jest.fn().mockResolvedValue(partyMock),
         save: jest.fn(),
         delete: jest.fn(),
      });

      guestRepository = createMock<Repository<Guest>>({
         create: jest.fn(),
         save: jest.fn(),
         delete: jest.fn(),
      });

      additionalInfo = createMock<Repository<AdditionalPartyInfo>>({
         create: jest.fn(),
         save: jest.fn(),
         delete: jest.fn(),
      });

      partyRepository = new PartyRepository(repository, guestRepository, additionalInfo);
   });

   describe('findOne', () => {
      it('should find one party with relations', async () => {
         const partyWithRelations = {
            ...partyMock,
            guests: partyMock.guests,
            address: partyMock.address,
            files: [],
         };

         jest
            .spyOn(repository, 'findOne')
            .mockResolvedValue(partyWithRelations);

         const result = await partyRepository.findOne('1');

         expect(result).toEqual(partyWithRelations);

         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id: '1', status: 'ACTIVE' },
            relations: ['guests', 'guests.user', 'address', 'files', 'additionalInfo'],
            order: { date: 'ASC' },
         });
      });
   });

   describe('findAll', () => {
      it('should find all parties for a user', async () => {
         jest.spyOn(repository, 'find').mockResolvedValue(partyList);

         const result = await partyRepository.findAll();

         expect(result).toEqual(partyList);

         expect(repository.find).toHaveBeenCalledWith({
            where: { status: 'ACTIVE' },
            relations: ['address'],
            order: { date: 'ASC' },
         });
      });
   });

   describe('findAllOwner', () => {
      it('should find all parties for an owner', async () => {
         jest.spyOn(repository, 'find').mockResolvedValue(partyList);

         const result = await partyRepository.findAllOwner('1');

         expect(result).toEqual(partyList);

         expect(repository.find).toHaveBeenCalledWith({
            where: { ownerId: '1' },
            order: { date: 'ASC' },
         });
      });
   });

   describe('findAllGuest', () => {
      it('should find all parties for a guest', async () => {
         const guestParties = partyList.filter((party) =>
            party.guests.some((guest) => guest.id === '1'),
         );

         jest.spyOn(repository, 'find').mockResolvedValue(guestParties);

         const result = await partyRepository.findAllInvited('1');

         expect(result).toEqual(guestParties);

         expect(repository.find).toHaveBeenCalledWith({
            where: { guests: { id: '1' } },
            order: { date: 'ASC' },
         });
      });
   });

   describe('create', () => {
      it('should create a party and its guests', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(partyMock);
         jest.spyOn(repository, 'save').mockResolvedValue(partyMock);

         const result = await partyRepository.create(createPartyDTO);

         expect(repository.save).toHaveBeenCalledWith(partyMock);

         for (const guest of createPartyDTO.guests) {
            expect(guestRepository.create).toHaveBeenCalledWith({
               userId: guest.id,
               partyId: partyMock.id,
            });
            expect(guestRepository.save).toHaveBeenCalled();
         }

         expect(result).toEqual(partyMock);
      });

      it('should create a party without guests', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(partyWithoutGuests);
         jest.spyOn(repository, 'save').mockResolvedValue(partyWithoutGuests);

         const result = await partyRepository.create(
            createPartyDTOWithoutGuests,
         );

         expect(repository.create).toHaveBeenCalledWith(
            createPartyDTOWithoutGuests,
         );
         expect(repository.save).toHaveBeenCalledWith(partyWithoutGuests);
         expect(guestRepository.create).not.toHaveBeenCalled();
         expect(guestRepository.save).not.toHaveBeenCalled();

         expect(result).toEqual(partyWithoutGuests);
      });
   });

   describe('update', () => {
      it('should update a party', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(partyUpdated);
         jest.spyOn(repository, 'update').mockResolvedValue(undefined);
         jest.spyOn(repository, 'findOne').mockResolvedValue(partyUpdated);

         const result = await partyRepository.update('1', updatePartyDTO);

         expect(repository.create).toHaveBeenCalledWith(updatePartyDTO);
         expect(repository.update).toHaveBeenCalledWith('1', updatePartyDTO);
         expect(result).toEqual(updatePartyDTO);
      });

      // TODO: Uncomment and complete this test once the guest update functionality is implemented
      // it('should update a party and its guests', async () => {
      //    const partyToUpdate = { ...party, ...updatePartyDTO };
      //    jest.spyOn(repository, 'create').mockReturnValue(partyToUpdate);
      //    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      //    jest.spyOn(repository, 'findOne').mockResolvedValue(partyToUpdate);
      //    jest.spyOn(guestRepository, 'create').mockReturnValue(guest);
      //    jest.spyOn(guestRepository, 'save').mockResolvedValue(guest);

      //    const result = await partyRepository.update('1', updatePartyDTO);

      //    expect(repository.create).toHaveBeenCalledWith(updatePartyDTO);
      //    expect(repository.update).toHaveBeenCalledWith('1', partyToUpdate);
      //    expect(repository.findOne).toHaveBeenCalledWith('1');
      //    for (const guest of updatePartyDTO.guests) {
      //       expect(guestRepository.create).toHaveBeenCalledWith({
      //          userId: guest.userId,
      //          partyId: '1',
      //       });
      //       expect(guestRepository.save).toHaveBeenCalled();
      //    }
      //    expect(result).toEqual(partyToUpdate);
      // });
   });

   describe('delete', () => {
      it('should delete a party', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);
         jest
            .spyOn(repository, 'delete')
            .mockResolvedValue({ affected: 1, raw: partyMock });

         const result = await partyRepository.delete('1');

         expect(repository.delete).toHaveBeenCalledWith({ id: '1' });

         expect(result).toEqual(partyMock);
      });
   });

   describe('createAdditionalInfo', () => {
      it('should create additional info and return the updated party', async () => {
         const partyId = '1';

         jest.spyOn(additionalInfo, 'create').mockImplementation(() => (additionalInfoMock));
         jest.spyOn(additionalInfo, 'save').mockResolvedValue(additionalInfoMock);
         jest.spyOn(repository, 'findOne').mockResolvedValue(partyWithAdditionalInfoMock);

         const result = await partyRepository.createAdditionalInfo(partyId, createAdditionalInfoMock);

         expect(additionalInfo.create).toHaveBeenCalledTimes(createAdditionalInfoMock.additionalInfo.length);

         createAdditionalInfoMock.additionalInfo.forEach((info) => {
            expect(additionalInfo.create).toHaveBeenCalledWith({
               ...info,
               partyId,
            });
         });

         expect(result).toEqual(partyWithAdditionalInfoMock);
      });
   });

   describe('deleteAdditionalInfo', () => {
      it('should delete additional info and return the updated party', async () => {
         const additionalInfoId = '1';
         const updatedPartyMock = {
            ...partyMock,
            additionalInfo: [],
         };

         jest.spyOn(additionalInfo, 'findOne').mockResolvedValue(additionalInfoMock);
         jest.spyOn(additionalInfo, 'delete').mockResolvedValue({ affected: 1, raw: additionalInfoMock });
         jest.spyOn(repository, 'findOne').mockResolvedValue(updatedPartyMock);

         const result = await partyRepository.deleteAdditionalInfo(additionalInfoId);

         expect(additionalInfo.findOne).toHaveBeenCalledWith({ where: { id: additionalInfoId } });
         expect(additionalInfo.delete).toHaveBeenCalledWith({ id: additionalInfoId });
         expect(result).toEqual(updatedPartyMock);
      });
   });

   describe('addGuests', () => {
      it('should add guests to a party', async () => {
         const partyId = '1';

         jest.spyOn(guestRepository, 'create').mockImplementation(() => {
            return guestMock;
         });
         jest.spyOn(guestRepository, 'save').mockResolvedValue(undefined);
         jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);

         const result = await partyRepository.addGuests(partyId, createGuestMock);

         expect(guestRepository.create).toHaveBeenCalledTimes(3);
         expect(guestRepository.save).toHaveBeenCalledTimes(1);
         expect(result).toEqual(partyMock);
      });
   });

   describe('deleteGuest', () => {
      it('should delete a guest and return the updated party', async () => {
         const guestId = '1';
         const guest = { id: guestId, partyId: '1' } as Guest;
         const updatedParty = { ...partyMock, guests: partyMock.guests.filter(g => g.id !== guestId) };

         jest.spyOn(guestRepository, 'findOne').mockResolvedValue(guest);
         jest.spyOn(guestRepository, 'delete').mockResolvedValue({ affected: 1, raw: guest });
         jest.spyOn(repository, 'findOne').mockResolvedValue(updatedParty);

         const result = await partyRepository.deleteGuest(guestId);

         expect(guestRepository.findOne).toHaveBeenCalledWith({ where: { id: guestId } });
         expect(guestRepository.delete).toHaveBeenCalledWith({ id: guestId });
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id: guest.partyId, status: 'ACTIVE' },
            relations: ['guests', 'guests.user', 'address', 'files', 'additionalInfo'],
            order: { date: 'ASC' },
         });
         expect(result).toEqual(updatedParty);
      });
   });
});
