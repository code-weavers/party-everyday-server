import { AddGuestDTO } from '@/modules/party/presenters/party.dto';
import { AddGuestsUseCase } from '@/modules/party/use-cases/add-guests.usecase';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { createGuestMock } from '../../../mocks/guest.mock';
import { partyMock } from '../../../mocks/party.mock';

describe('AddGuestsUseCase', () => {
   let useCase: AddGuestsUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;

   beforeEach(() => {
      logger = {
         log: jest.fn(),
      } as unknown as ILogger;

      repository = {
         addGuests: jest.fn(),
      } as unknown as IPartyRepository;

      useCase = new AddGuestsUseCase(logger, repository);
   });

   it('should add guests successfully', async () => {
      const guests: AddGuestDTO = createGuestMock;

      jest.spyOn(repository, 'addGuests').mockResolvedValue(partyMock);

      const result = await useCase.execute('1', guests);

      expect(logger.log).toHaveBeenCalledWith(
         'AddGuestsUseCase execute()',
         `Adding new guests with params: ${JSON.stringify({ partyId: '1', guests })}`
      );
      expect(logger.log).toHaveBeenCalledWith(
         'AddGuestsUseCase execute()',
         'New guests have been added successfully'
      );

      expect(result).toEqual(partyMock);
   });

   it('should handle errors when adding guests fails', async () => {
      const partyId = '123';
      const error = new Error('Failed to add guests');

      jest.spyOn(repository, 'addGuests').mockRejectedValue(error);

      await expect(useCase.execute(partyId, createGuestMock)).rejects.toThrow(error);

      expect(logger.log).toHaveBeenCalledWith(
         'AddGuestsUseCase execute()',
         `Adding new guests with params: ${JSON.stringify({ partyId, guests: createGuestMock })}`
      );
   });
});