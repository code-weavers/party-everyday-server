import { OwnerType } from '@/common/enums/ownerType.enum';
import { DeleteUserUseCase } from '@/modules/user/use-cases/delete-user.usecase';
import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { IEnvironmentConfigService } from '@interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUploadService } from '@interfaces/abstracts/upload.service';
import { IFileRepository } from '@interfaces/repositories/file.repository';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

describe('DeleteUserUseCase', () => {
   let useCase: DeleteUserUseCase;
   let loggerMock: ILogger;
   let userRepositoryMock: IUserRepository;
   let uploadServiceMock: IUploadService;
   let environmentConfigMock: IEnvironmentConfigService;
   let fileRepositoryMock: IFileRepository;

   beforeEach(() => {
      loggerMock = createMock<ILogger>();
      userRepositoryMock = createMock<IUserRepository>({
         delete: jest.fn(),
         findOne: jest.fn(),
      });
      uploadServiceMock = createMock<IUploadService>({
         deleteFile: jest.fn(),
      });
      environmentConfigMock = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });
      fileRepositoryMock = createMock<IFileRepository>({
         findOne: jest.fn(),
         delete: jest.fn(),
      });

      useCase = new DeleteUserUseCase(
         loggerMock,
         userRepositoryMock,
         uploadServiceMock,
         environmentConfigMock,
         fileRepositoryMock,
      );
   });

   it('should delete user successfully', async () => {
      const user = new User();

      jest.spyOn(userRepositoryMock, 'delete').mockResolvedValue(user);

      const result = await useCase.execute('1');

      expect(result).toBe(user);

      expect(userRepositoryMock.delete).toHaveBeenCalledWith('1');
   });

   it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(userRepositoryMock, 'delete').mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);

      expect(userRepositoryMock.delete).toHaveBeenCalledWith('1');
   });

   describe('deleteFile', () => {
      it('should delete file successfully when it exists', async () => {
         const file = new File();
         jest.spyOn(fileRepositoryMock, 'findOne').mockResolvedValue(file);
         jest.spyOn(fileRepositoryMock, 'delete').mockResolvedValue(file);

         const result = await (useCase as any).deleteFile('1');

         expect(result).toBe(file);
         expect(fileRepositoryMock.delete).toHaveBeenCalledWith(
            '1',
            OwnerType.USER,
         );
      });

      it('should not attempt to delete file when it does not exist', async () => {
         jest.spyOn(fileRepositoryMock, 'findOne').mockResolvedValue(null);

         const result = await (useCase as any).deleteFile('1');

         expect(result).toBeUndefined();
         expect(fileRepositoryMock.delete).not.toHaveBeenCalled();
      });

      it('should call uploadService.deleteFile when environmentConfig.getCloudUpload returns true', async () => {
         const file = new File();
         jest.spyOn(fileRepositoryMock, 'findOne').mockResolvedValue(file);
         jest
            .spyOn(environmentConfigMock, 'getCloudUpload')
            .mockReturnValue(true);

         await (useCase as any).deleteFile('1');

         expect(uploadServiceMock.deleteFile).toHaveBeenCalledWith([file.key]);
      });

      it('should not call uploadService.deleteFile when environmentConfig.getCloudUpload returns false', async () => {
         const file = new File();
         jest.spyOn(fileRepositoryMock, 'findOne').mockResolvedValue(file);
         jest
            .spyOn(environmentConfigMock, 'getCloudUpload')
            .mockReturnValue(false);

         await (useCase as any).deleteFile('1');

         expect(uploadServiceMock.deleteFile).not.toHaveBeenCalled();
      });
   });
});
