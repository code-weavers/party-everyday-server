import { Party } from '@/entities/party.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class RemoveGuestUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
   ) { }

   public async execute(id: string): Promise<Party> {
      const removedGuest = await this.repository.deleteGuest(id);

      this.logger.log(
         'RemoveGuestUseCase execute()',
         `Guest ${id} have been removed successfully`,
      );

      return removedGuest;
   }
}
