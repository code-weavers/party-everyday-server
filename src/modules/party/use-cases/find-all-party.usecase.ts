import { Party } from '@entities/party.entity';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class FindAllPartyUseCase {
   constructor(
      private readonly repository: IPartyRepository,
      private readonly cacheManager: ICacheManager,
   ) {}

   public async execute(ownerId: string): Promise<Party[]> {
      const cachedPartys =
         await this.cacheManager.getCachedObject<Party[]>('parties');

      if (cachedPartys) return cachedPartys;

      const parties = await this.repository.findAll(ownerId);

      await this.cacheManager.setObjectInCache('parties', parties);

      return parties;
   }
}
