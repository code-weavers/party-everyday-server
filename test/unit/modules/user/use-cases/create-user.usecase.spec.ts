import { IBcryptService } from '@/common/interfaces/abstracts/bcrypt.service';
import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { IJwtService } from '@/common/interfaces/abstracts/jwt.service';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { CreateUserUseCase } from '@/modules/user/use-cases/create-user.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ForbiddenException } from '@nestjs/common';
import { createdLocalFile } from '../../../mocks/file.mock';
import { createUserDTO, user } from '../../../mocks/user.mock';

describe('CreateUserUseCase', () => {
   let useCase: CreateUserUseCase;
   let mockLogger: ILogger;
   let mockUserRepository: IUserRepository;
   let mockFileRepository: IFileRepository;
   let mockBcryptService: IBcryptService;
   let mockJwtService: IJwtService;
   let mockUploadService: IUploadService;
   let mockEnvironmentConfig: IEnvironmentConfigService;

   beforeEach(() => {
      mockLogger = createMock<ILogger>({ log: jest.fn() });
      mockUserRepository = createMock<IUserRepository>({
         alreadyExists: jest.fn(),
         create: jest.fn(),
      });
      mockFileRepository = createMock<IFileRepository>({ create: jest.fn() });
      mockBcryptService = createMock<IBcryptService>({ createHash: jest.fn() });
      mockJwtService = createMock<IJwtService>({ createToken: jest.fn() });
      mockUploadService = createMock<IUploadService>({ uploadFile: jest.fn() });
      mockEnvironmentConfig = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });

      useCase = new CreateUserUseCase(
         mockLogger,
         mockUserRepository,
         mockFileRepository,
         mockBcryptService,
         mockJwtService,
         mockUploadService,
         mockEnvironmentConfig,
      );
   });

   it('should throw ForbiddenException if email already exists', async () => {
      jest.spyOn(mockUserRepository, 'alreadyExists').mockResolvedValue(true);

      await expect(useCase.execute(createUserDTO)).rejects.toThrow(
         ForbiddenException,
      );
   });

   it('should call createFile and uploadFile if file is provided and cloud upload is enabled', async () => {
      jest.spyOn(mockUserRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(mockEnvironmentConfig, 'getCloudUpload').mockReturnValue(true);
      jest
         .spyOn(mockUploadService, 'uploadFile')
         .mockResolvedValue(createdLocalFile);
      jest.spyOn(mockUserRepository, 'create').mockResolvedValue(user);

      await useCase.execute(createUserDTO, createdLocalFile);

      expect(mockUploadService.uploadFile).toHaveBeenCalledWith(
         createdLocalFile,
      );
      expect(mockFileRepository.create).toHaveBeenCalled();
   });

   it('should hash the user password', async () => {
      jest.spyOn(mockUserRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(mockUserRepository, 'create').mockResolvedValue(user);

      await useCase.execute(createUserDTO);

      expect(mockBcryptService.createHash).toHaveBeenCalledWith(
         createUserDTO.password,
      );
   });

   it('should create a new user and return it with an access token', async () => {
      jest.spyOn(mockUserRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(mockUserRepository, 'create').mockResolvedValueOnce(user);
      jest.spyOn(mockJwtService, 'createToken').mockReturnValue('token');

      const result = await useCase.execute(createUserDTO);

      expect(result).toHaveProperty('accessToken');
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDTO);
      expect(mockJwtService.createToken).toHaveBeenCalledWith({
         id: result.id,
      });
   });
});
