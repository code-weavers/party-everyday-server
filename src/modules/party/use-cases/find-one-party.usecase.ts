import { Party } from '@entities/party.entity';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { NotFoundException } from '@nestjs/common';

export class FindOnePartyUseCase {
   constructor(
      private readonly repository: IPartyRepository,
      private readonly cacheManager: ICacheManager,
   ) {}

   public async execute(id: string): Promise<Party> {
      const cachedParty =
         await this.cacheManager.getCachedObject<Party>('party');

      if (cachedParty && cachedParty.id === id) return cachedParty;

      const party: Party = await this.repository.findOne(id);

      if (!party) throw new NotFoundException({ message: 'Party not found' });

      await this.cacheManager.setObjectInCache('party', party);

      return party;
   }
}
