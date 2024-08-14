import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';

export class DeleteAdditionalInfoUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
   ) { }

   public async execute(id: string): Promise<AdditionalPartyInfo> {
      const partyDeleted = await this.repository.deleteAdditionalInfo(id);

      this.logger.log(
         'DeleteAdditionalInfoUseCase execute()',
         `Party Additional Info ${id} have been deleted`,
      );

      return partyDeleted;
   }
}
