import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { ICacheManager } from '../../../../src/common/interfaces/abstracts/cache.service';
import { CacheService } from '../../../../src/services/redis/cache.service';

describe('CacheService', () => {
   let cacheService: ICacheManager;
   let cacheManager: Cache = createMock();

   beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
         providers: [
            CacheService,
            {
               provide: CACHE_MANAGER,
               useValue: createMock(),
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      cacheService = moduleRef.get<CacheService>(CacheService);
      cacheManager = moduleRef.get<Cache>(CACHE_MANAGER);
   });

   it('should get cached object', async () => {
      const key = 'testKey';
      const value = JSON.stringify({ data: 'testData' });

      jest.spyOn(cacheManager, 'get').mockResolvedValue(value);

      const result = await cacheService.getCachedObject(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(JSON.parse(value));
   });

   it('should return undefined if no cached object', async () => {
      const key = 'testKey';

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      const result = await cacheService.getCachedObject(key);

      expect(cacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBeUndefined();
   });

   it('should set object in cache', async () => {
      const key = 'testKey';
      const value = { data: 'testData' };

      await cacheService.setObjectInCache(key, value);

      expect(cacheManager.set).toHaveBeenCalledWith(key, JSON.stringify(value));
   });
});
