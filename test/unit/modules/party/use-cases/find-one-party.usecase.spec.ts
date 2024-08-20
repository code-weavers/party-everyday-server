import { FindOnePartyUseCase } from '@/modules/party/use-cases/find-one-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { NotFoundException } from '@nestjs/common';
import { partyMock } from '../../../mocks/party.mock';

describe('FindOnePartyUseCase', () => {
   let useCase: FindOnePartyUseCase;
   let repository: jest.Mocked<IPartyRepository>;
   let cacheManager: jest.Mocked<ICacheManager>;

   beforeEach(() => {
      repository = createMock<IPartyRepository>({ findOne: jest.fn() });
      cacheManager = createMock<ICacheManager>({
         getCachedObject: jest.fn(),
         setObjectInCache: jest.fn(),
      });
      useCase = new FindOnePartyUseCase(repository, cacheManager);
   });

   it('should return the party from the cache if it exists', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(partyMock);

      const result = await useCase.execute('1');

      expect(result).toEqual(partyMock);
      expect(repository.findOne).not.toHaveBeenCalled();
   });

   it('should return the party from the repository if it is not in the cache', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);

      const result = await useCase.execute('1');

      expect(result).toEqual(partyMock);
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith(
         'party-1',
         partyMock,
      );
   });

   it('should throw a NotFoundException if the party is not found', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);

      expect(cacheManager.getCachedObject).toHaveBeenCalledWith('party-1');
      expect(repository.findOne).toHaveBeenCalledWith('1');
   });
});
