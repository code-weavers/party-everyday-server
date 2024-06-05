import { Party } from '@entities/party.entity';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class FindAllOwnerPartiesUseCase {
   constructor(
      private readonly repository: IPartyRepository,
      private readonly cacheManager: ICacheManager,
   ) {}

   public async execute(ownerId: string): Promise<Party[]> {
      const key = 'ownerParties-' + ownerId;

      const cachedPartys =
         await this.cacheManager.getCachedObject<Party[]>(key);

      if (cachedPartys) return cachedPartys;

      const parties = await this.repository.findAllOwner(ownerId);

      await this.cacheManager.setObjectInCache(key, parties);

      return parties;
   }
}
