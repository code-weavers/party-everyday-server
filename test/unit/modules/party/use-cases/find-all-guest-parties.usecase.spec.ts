import { FindAllGuestPartiesUseCase } from '@/modules/party/use-cases/find-all-guest-parties.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { partyList } from '../../../mocks/party.mock';

describe('FindAllGuestPartiesUseCase', () => {
   let useCase: FindAllGuestPartiesUseCase;
   let mockPartyRepository: IPartyRepository;
   let mockCacheManager: ICacheManager;

   beforeEach(() => {
      mockPartyRepository = createMock<IPartyRepository>({
         findAllOwner: jest.fn().mockResolvedValue(partyList),
      });

      mockCacheManager = createMock<ICacheManager>({
         getCachedObject: jest.fn(),
         setObjectInCache: jest.fn(),
      });

      useCase = new FindAllGuestPartiesUseCase(
         mockPartyRepository,
         mockCacheManager,
      );
   });

   it('should return parties from cache if they exist', async () => {
      const guestId = '1';

      jest
         .spyOn(mockCacheManager, 'getCachedObject')
         .mockResolvedValue(partyList);

      const result = await useCase.execute(guestId);

      expect(result).toEqual(partyList);

      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith(
         'guestParties-' + guestId,
      );

      expect(mockPartyRepository.findAllGuest).not.toHaveBeenCalled();
   });

   it('should return parties from repository and cache them if they do not exist in cache', async () => {
      const guestId = '1';

      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest
         .spyOn(mockPartyRepository, 'findAllGuest')
         .mockResolvedValue(partyList);

      const result = await useCase.execute(guestId);

      expect(result).toEqual(partyList);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith(
         'guestParties-' + guestId,
      );

      expect(mockCacheManager.setObjectInCache).toHaveBeenCalledWith(
         'guestParties-' + guestId,
         partyList,
      );
   });
});
