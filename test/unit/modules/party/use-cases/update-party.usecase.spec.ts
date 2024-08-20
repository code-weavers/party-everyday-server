import { UpdatePartyUseCase } from '@/modules/party/use-cases/update-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { partyUpdated, updatePartyDTO } from '../../../mocks/party.mock';

describe('UpdatePartyUseCase', () => {
   let logger: ILogger;
   let repository: IPartyRepository;
   let useCase: UpdatePartyUseCase;

   beforeEach(() => {
      logger = createMock<ILogger>({ log: jest.fn() });
      repository = createMock<IPartyRepository>({
         update: jest.fn(),
         findOne: jest.fn(),
      });

      useCase = new UpdatePartyUseCase(logger, repository);
   });

   it('should update a party and return the updated party', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyUpdated);

      const result = await useCase.execute('1', updatePartyDTO);

      expect(repository.update).toHaveBeenCalledWith('1', updatePartyDTO);
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(logger.log).toHaveBeenCalledWith(
         'UpdatePartyUseCases execute()',
         `Party ${partyUpdated.name} have been updated`,
      );
      expect(result).toEqual(partyUpdated);
   });
});
