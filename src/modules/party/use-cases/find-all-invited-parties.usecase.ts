import { Party } from '@entities/party.entity';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class FindAllGuestPartiesUseCase {
   constructor(
      private readonly repository: IPartyRepository,
      private readonly cacheManager: ICacheManager,
   ) { }

   public async execute(guestId: string): Promise<Party[]> {
      const key = 'guestParties-' + guestId;

      const cachedPartys =
         await this.cacheManager.getCachedObject<Party[]>(key);

      if (cachedPartys) return cachedPartys;

      const parties = await this.repository.findAllInvited(guestId);

      await this.cacheManager.setObjectInCache(key, parties);

      return parties;
   }
}
