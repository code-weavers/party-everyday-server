import { Party } from '@/entities/party.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { AddGuestDTO } from '../presenters/party.dto';

export class AddGuestsUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
   ) { }

   public async execute(partyId: string, guests: AddGuestDTO): Promise<Party> {
      this.logger.log('AddGuestsUseCase execute()', `Adding new guests with params: ${JSON.stringify({ partyId, guests })}`);

      const addedGuests = await this.repository.addGuests(partyId, guests);

      this.logger.log(
         'AddGuestsUseCase execute()',
         'New guests have been added successfully',
      );

      return addedGuests;
   }
}
