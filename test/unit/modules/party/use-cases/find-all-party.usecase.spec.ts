import { FindAllPartyUseCase } from '@/modules/party/use-cases/find-all-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { partyList } from '../../../mocks/party.mock';

describe('FindAllPartyUseCase', () => {
   let repository: IPartyRepository;
   let cacheManager: ICacheManager;
   let useCase: FindAllPartyUseCase;

   beforeEach(() => {
      repository = createMock<IPartyRepository>({
         findAll: jest.fn(),
      });
      cacheManager = createMock<ICacheManager>({
         getCachedObject: jest.fn(),
         setObjectInCache: jest.fn(),
      });
      useCase = new FindAllPartyUseCase(repository, cacheManager);
   });

   it('should return cached parties if they exist', async () => {
      const ownerId = 'testOwnerId';

      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(partyList);

      const result = await useCase.execute(ownerId);

      expect(result).toEqual(partyList);
   });

   it('should fetch parties from repository and cache them if they do not exist in cache', async () => {
      const ownerId = 'testOwnerId';

      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findAll').mockResolvedValue(partyList);

      const result = await useCase.execute(ownerId);

      expect(result).toEqual(partyList);
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith(
         'parties',
         partyList,
      );
   });
});
