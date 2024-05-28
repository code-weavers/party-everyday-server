import { OwnerType } from '@/common/enums/ownerType.enum';
import { File } from '@/entities/file.entity';
import { Party } from '@entities/party.entity';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';

export class UpdatePartyFileUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IPartyRepository,
      private readonly fileRepository: IFileRepository,
      private readonly uploadService: IUploadService,
      private readonly environmentConfig: IEnvironmentConfigService,
   ) {}

   public async execute(id: string, files?: CreateFileDTO[]): Promise<Party> {
      const updatedFiles = await this.createOrUpdateFile(id, files);

      await this.repository.update(id, { files: updatedFiles });

      const updatedParty = await this.repository.findOne(id);

      this.logger.log(
         'UpdatePartyFileUseCases execute()',
         `Files of ${updatedParty.name} have been updated`,
      );

      return updatedParty;
   }

   private async createOrUpdateFile(
      id: string,
      filesUploaded: CreateFileDTO[],
   ): Promise<File[]> {
      let files: File[];

      const partyFiles = await this.fileRepository.findAll(id, OwnerType.PARTY);

      if (partyFiles) {
         if (this.environmentConfig.getCloudUpload()) {
            const keys = partyFiles.map((file) => file.key);
            await this.uploadService.deleteFile(keys);

            for (let file of filesUploaded) {
               file = await this.uploadService.uploadFile(file);
            }
         }

         files = await this.fileRepository.updateMany(
            filesUploaded,
            id,
            OwnerType.PARTY,
         );
      } else {
         if (this.environmentConfig.getCloudUpload()) {
            for (let file of filesUploaded) {
               file = await this.uploadService.uploadFile(file);
            }
         }

         for (const file of filesUploaded) {
            files.push(
               await this.fileRepository.create(file, id, OwnerType.PARTY),
            );
         }
      }

      return files;
   }
}
