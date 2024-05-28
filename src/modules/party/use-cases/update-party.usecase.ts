import { Party } from '@entities/party.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { UpdatePartyDTO } from '../presenters/party.dto';

export class UpdatePartyUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
   ) {}

   public async execute(id: string, party: UpdatePartyDTO): Promise<Party> {
      await this.repository.update(id, party);

      const updatedParty = await this.repository.findOne(id);

      this.logger.log(
         'UpdatePartyUseCases execute()',
         `Party ${updatedParty.name} have been updated`,
      );

      return updatedParty;
   }
}
