import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import { PartyRepository } from '@/modules/party/party.repository';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import {
   createPartyDTO,
   createPartyDTOWithoutGuests,
   party,
   partyList,
   partyUpdated,
   partyWithoutGuests,
   updatePartyDTO,
} from '../../mocks/party.mock';

describe('PartyRepository', () => {
   let partyRepository: PartyRepository;
   let repository: Repository<Party>;
   let guestRepository: Repository<Guest>;

   beforeEach(() => {
      repository = createMock<Repository<Party>>({
         find: jest.fn(),
         findOne: jest.fn().mockResolvedValue(party),
         save: jest.fn(),
         delete: jest.fn(),
      });

      guestRepository = createMock<Repository<Guest>>({
         create: jest.fn(),
         save: jest.fn(),
      });

      partyRepository = new PartyRepository(repository, guestRepository);
   });

   describe('findOne', () => {
      it('should find one party with relations', async () => {
         const partyWithRelations = {
            ...party,
            guests: party.guests,
            address: party.address,
            files: [],
         };

         jest
            .spyOn(repository, 'findOne')
            .mockResolvedValue(partyWithRelations);

         const result = await partyRepository.findOne('1');

         expect(result).toEqual(partyWithRelations);

         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id: '1' },
            relations: ['guests.user', 'address', 'files'],
            order: { date: 'ASC' },
         });
      });
   });

   describe('findAll', () => {
      it('should find all parties for a user', async () => {
         jest.spyOn(repository, 'find').mockResolvedValue(partyList);

         const result = await partyRepository.findAll('1');

         expect(result).toEqual(partyList);

         expect(repository.find).toHaveBeenCalledWith({
            where: { ownerId: '1', guests: { id: '1' } },
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

   describe('create', () => {
      it('should create a party and its guests', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(party);
         jest.spyOn(repository, 'save').mockResolvedValue(party);

         const result = await partyRepository.create(createPartyDTO);

         expect(repository.save).toHaveBeenCalledWith(party);

         for (const guest of createPartyDTO.guests) {
            expect(guestRepository.create).toHaveBeenCalledWith({
               userId: guest.id,
               partyId: party.id,
            });
            expect(guestRepository.save).toHaveBeenCalled();
         }

         expect(result).toEqual(party);
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
         jest.spyOn(repository, 'findOne').mockResolvedValue(party);
         jest
            .spyOn(repository, 'delete')
            .mockResolvedValue({ affected: 1, raw: party });

         const result = await partyRepository.delete('1');

         expect(repository.delete).toHaveBeenCalledWith({ id: '1' });

         expect(result).toEqual(party);
      });
   });
});
