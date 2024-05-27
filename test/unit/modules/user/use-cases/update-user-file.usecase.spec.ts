import { OwnerType } from '@/common/enums/ownerType.enum';
import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { UpdateUserFileUseCase } from '@/modules/user/use-cases/update-user-file.usecase';
import { createMock } from '@golevelup/ts-jest';
import {
   createdLocalFile,
   createdUploadFile,
   file,
   uploadedFile,
} from '../../../mocks/file.mock';
import { userWithFile } from '../../../mocks/user.mock';

describe('UpdateUserFileUseCase', () => {
   let useCase: UpdateUserFileUseCase;
   let loggerService: ILogger;
   let userRepository: IUserRepository;
   let fileRepository: IFileRepository;
   let uploadService: IUploadService;
   let environmentConfig: IEnvironmentConfigService;

   beforeEach(() => {
      loggerService = createMock<ILogger>();
      userRepository = createMock<IUserRepository>({
         findOne: jest.fn().mockResolvedValue(userWithFile),
         update: jest.fn(),
         create: jest.fn(),
      });
      fileRepository = createMock<IFileRepository>({
         findOne: jest.fn(),
         update: jest.fn(),
         create: jest.fn(),
      });
      uploadService = createMock<IUploadService>({
         deleteFile: jest.fn(),
         uploadFile: jest.fn().mockResolvedValue(createdUploadFile),
      });
      environmentConfig = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });

      useCase = new UpdateUserFileUseCase(
         loggerService,
         userRepository,
         fileRepository,
         uploadService,
         environmentConfig,
      );
   });

   it('should delete, upload and update file when cloud upload is enabled and user file exists', async () => {
      const id = 'test-id';

      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(true);
      jest.spyOn(fileRepository, 'findOne').mockResolvedValue(file);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userWithFile);
      jest.spyOn(userRepository, 'update').mockResolvedValue(userWithFile);
      jest.spyOn(userRepository, 'create').mockResolvedValue(userWithFile);
      jest.spyOn(uploadService, 'deleteFile').mockResolvedValue(undefined);
      jest
         .spyOn(uploadService, 'uploadFile')
         .mockResolvedValue(createdUploadFile);

      const result = await useCase.execute(id, createdUploadFile);

      expect(result).toEqual(userWithFile);

      expect(uploadService.deleteFile).toHaveBeenCalledWith([file.key]);
      expect(uploadService.uploadFile).toHaveBeenCalledWith(uploadedFile);
   });

   it('should upload and create file when cloud upload is enabled and user file does not exist', async () => {
      const id = 'test-id';

      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(true);
      jest.spyOn(fileRepository, 'findOne').mockResolvedValue(null);
      jest
         .spyOn(uploadService, 'uploadFile')
         .mockResolvedValue(createdUploadFile);
      jest.spyOn(userRepository, 'update').mockResolvedValue(userWithFile);

      await useCase.execute(id, createdUploadFile);

      expect(uploadService.uploadFile).toHaveBeenCalledWith(uploadedFile);
      expect(fileRepository.create).toHaveBeenCalledWith(
         createdUploadFile,
         id,
         OwnerType.USER,
      );
   });

   it('should update file when cloud upload is disabled and user file exists', async () => {
      const id = 'test-id';

      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(false);
      jest.spyOn(fileRepository, 'findOne').mockResolvedValue(file);
      jest.spyOn(userRepository, 'update').mockResolvedValue(userWithFile);

      await useCase.execute(id, createdLocalFile);

      expect(fileRepository.update).toHaveBeenCalledWith(
         createdLocalFile,
         id,
         OwnerType.USER,
      );
   });

   it('should create file when cloud upload is disabled and user file does not exist', async () => {
      const id = 'test-id';

      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(false);

      jest.spyOn(fileRepository, 'findOne').mockResolvedValue(null);

      await useCase['createOrUpdateFile'](id, createdLocalFile);

      expect(fileRepository.create).toHaveBeenCalledWith(
         createdLocalFile,
         id,
         OwnerType.USER,
      );
   });
});
