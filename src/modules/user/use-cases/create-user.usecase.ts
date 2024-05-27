import { OwnerType } from '@enums/ownerType.enum';
import { IBcryptService } from '@interfaces/abstracts/bcrypt.service';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { IJwtService } from '@interfaces/abstracts/jwt.service';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { CreateFileDTO } from '@modules/file/presenters/file.dto';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from '../presenters/user.dto';
import { UserPresenter } from '../presenters/user.presenter';

export class CreateUserUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IUserRepository,
      private readonly fileRepository: IFileRepository,
      private readonly bcryptService: IBcryptService,
      private readonly jwtService: IJwtService,
      private readonly uploadService: IUploadService,
      private readonly environmentConfig: IEnvironmentConfigService,
   ) {}

   public async execute(
      user: CreateUserDTO,
      file?: CreateFileDTO,
   ): Promise<UserPresenter> {
      if (await this.repository.alreadyExists('email', user.email)) {
         throw new ForbiddenException({
            message: 'Email already exists in app!',
            statusCode: HttpStatus.FORBIDDEN,
         });
      }

      if (file) user.file = await this.createFile(user.id, file);

      user.password = await this.bcryptService.createHash(user.password);

      const createdUser: UserPresenter = new UserPresenter(
         await this.repository.create(user),
      );

      createdUser.accessToken = this.jwtService.createToken({
         id: createdUser.id,
      });

      this.logger.log(
         'CreateUserUseCases execute()',
         'New user have been inserted',
      );

      return createdUser;
   }

   private async createFile(
      id: string,
      file: CreateFileDTO,
   ): Promise<CreateFileDTO> {
      let fileUploaded: CreateFileDTO = file;

      if (this.environmentConfig.getCloudUpload()) {
         fileUploaded = await this.uploadService.uploadFile(file);
      }

      return await this.fileRepository.create(fileUploaded, id, OwnerType.USER);
   }
}
