import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { CreateAdditionalInfoDTO } from '../presenters/party.dto';

export class CreateAdditionalInfoUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
   ) { }

   public async execute(partyId: string, additionalInfo: CreateAdditionalInfoDTO): Promise<AdditionalPartyInfo> {
      this.logger.log(' CreateAdditionalInfoUseCase execute()', `Creating new additional info with params: ${JSON.stringify(additionalInfo)}`)

      const createdAdditionalInfo = await this.repository.createAdditionalInfo(partyId, additionalInfo);

      this.logger.log(
         'CreateAdditionalInfoUseCase execute()',
         'New additional info have been created',
      );

      return createdAdditionalInfo;
   }
}
