import { FindAllOwnerPartiesUseCase } from '@/modules/party/use-cases/find-all-owner-parties.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { partyList } from '../../../mocks/party.mock';

describe('FindAllOwnerPartiesUseCase', () => {
   let useCase: FindAllOwnerPartiesUseCase;
   let repository: IPartyRepository;
   let cacheManager: ICacheManager;

   beforeEach(() => {
      repository = createMock<IPartyRepository>({
         findAllOwner: jest.fn().mockResolvedValue(partyList),
      });
      cacheManager = createMock<ICacheManager>({
         getCachedObject: jest.fn(),
         setObjectInCache: jest.fn(),
      });
      useCase = new FindAllOwnerPartiesUseCase(repository, cacheManager);
   });

   it('should return cached parties if available', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(partyList);

      const result = await useCase.execute('ownerId');

      expect(result).toEqual(partyList);
      expect(cacheManager.getCachedObject).toHaveBeenCalledWith(
         'ownerParties-ownerId',
      );
      expect(repository.findAllOwner).not.toHaveBeenCalled();
   });

   it('should fetch from repository and cache if parties are not cached', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);

      const result = await useCase.execute('ownerId');

      expect(result).toEqual(partyList);
      expect(cacheManager.getCachedObject).toHaveBeenCalledWith(
         'ownerParties-ownerId',
      );
      expect(repository.findAllOwner).toHaveBeenCalledWith('ownerId');
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith(
         'ownerParties-ownerId',
         partyList,
      );
   });
});
