import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { IGatewayService } from '@/common/interfaces/abstracts/gateway.service';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IAddressRepository } from '@/common/interfaces/repositories/address.repository';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { CreatePartyUseCase } from '@/modules/party/use-cases/create-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { partyFileList } from '../../../mocks/file.mock';
import { createPartyDTO, partyMock } from '../../../mocks/party.mock';

describe('CreatePartyUseCase', () => {
   let useCase: CreatePartyUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;
   let fileRepository: IFileRepository;
   let addressRepository: IAddressRepository;
   let userRepository: IUserRepository;
   let uploadService: IUploadService;
   let environmentConfig: IEnvironmentConfigService;
   let gatewayService: IGatewayService;

   beforeEach(() => {
      logger = createMock<ILogger>({ log: jest.fn() });
      repository = createMock<IPartyRepository>({
         create: jest.fn(),
         findOne: jest.fn(),
      });
      fileRepository = createMock<IFileRepository>({ create: jest.fn() });
      addressRepository = createMock<IAddressRepository>({ create: jest.fn() });
      userRepository = createMock<IUserRepository>({ findOne: jest.fn() });
      uploadService = createMock<IUploadService>({ uploadFile: jest.fn() });
      environmentConfig = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });
      gatewayService = createMock<IGatewayService>({ sendNotification: jest.fn() });

      useCase = new CreatePartyUseCase(
         logger,
         repository,
         fileRepository,
         addressRepository,
         userRepository,
         uploadService,
         environmentConfig,
         gatewayService,
      );
   });

   it('should create a party without files', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);
      jest.spyOn(addressRepository, 'create').mockResolvedValue(partyMock.address);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(partyMock.guests[0].user);

      const result = await useCase.execute(createPartyDTO);

      expect(logger.log).toHaveBeenCalledWith(
         'CreatePartyUseCases execute()',
         'New party have been created',
      );
      expect(result).toEqual(partyMock);
   });

   it('should create a party with files and without cloud upload', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(false);
      jest.spyOn(addressRepository, 'create').mockResolvedValue(partyMock.address);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(partyMock.guests[0].user);

      const result = await useCase.execute(createPartyDTO, partyFileList);

      expect(fileRepository.create).toHaveBeenCalledTimes(partyFileList.length);
      expect(uploadService.uploadFile).not.toHaveBeenCalled();
      expect(result).toEqual(partyMock);
   });

   it('should create a party with files and with cloud upload', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(true);
      jest.spyOn(addressRepository, 'create').mockResolvedValue(partyMock.address);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(partyMock.guests[0].user);
      jest
         .spyOn(uploadService, 'uploadFile')
         .mockResolvedValue({ url: 'uploadedFile' });

      const result = await useCase.execute(createPartyDTO, partyFileList);

      expect(fileRepository.create).toHaveBeenCalledTimes(partyFileList.length);
      expect(uploadService.uploadFile).toHaveBeenCalledTimes(
         partyFileList.length,
      );
      expect(result).toEqual(partyMock);
   });
});
