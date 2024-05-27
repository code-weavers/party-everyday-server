import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { OwnerType } from '@enums/ownerType.enum';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { HttpStatus, NotFoundException } from '@nestjs/common';

export class DeleteUserUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IUserRepository,
      private readonly uploadService: IUploadService,
      private readonly environmentConfig: IEnvironmentConfigService,
      private readonly fileRepository: IFileRepository,
   ) {}

   public async execute(id: string): Promise<User> {
      const userDeleted = await this.repository.delete(id);
      await this.deleteFile(id);

      if (userDeleted) {
         this.logger.log(
            'DeleteUserUseCases execute()',
            `User ${id} have been deleted`,
         );

         return userDeleted;
      } else {
         throw new NotFoundException({
            message: 'User not found!',
            statusCode: HttpStatus.NOT_FOUND,
         });
      }
   }

   private async deleteFile(id: string): Promise<File> {
      const file = await this.fileRepository.findOne(id, OwnerType.USER);

      if (!file) return;

      if (this.environmentConfig.getCloudUpload()) {
         await this.uploadService.deleteFile([file.key]);
      }

      return await this.fileRepository.delete(id, OwnerType.USER);
   }
}
