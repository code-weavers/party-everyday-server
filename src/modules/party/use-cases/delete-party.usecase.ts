import { StatusParty } from '@/common/enums/statusParty.enum';
import { Party } from '@entities/party.entity';
import { OwnerType } from '@enums/ownerType.enum';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import {
   HttpStatus,
   NotAcceptableException,
   NotFoundException,
} from '@nestjs/common';

export class DeletePartyUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
      private readonly uploadService: IUploadService,
      private readonly fileRepository: IFileRepository,
      private readonly environmentConfig: IEnvironmentConfigService,
   ) {}

   public async execute(id: string): Promise<Party> {
      const partyToDelete = await this.repository.findOne(id);

      if (partyToDelete) {
         if (partyToDelete.status === StatusParty.ACTIVE)
            throw new NotAcceptableException({
               message: 'Party is active!',
               statusCode: HttpStatus.NOT_ACCEPTABLE,
            });

         const partyDeleted = await this.repository.delete(id);

         await this.deleteFiles(id);

         this.logger.log(
            'DeletePartyUseCases execute()',
            `Party ${id} have been deleted`,
         );

         return partyDeleted;
      } else {
         throw new NotFoundException({
            message: 'Party not found!',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   }

   private async deleteFiles(id: string): Promise<void> {
      const files = await this.fileRepository.findAll(id, OwnerType.PARTY);

      if (!files.length) return;

      if (this.environmentConfig.getCloudUpload()) {
         const keys = files.map((file) => file.key);

         await this.uploadService.deleteFile(keys);
      }
   }
}
