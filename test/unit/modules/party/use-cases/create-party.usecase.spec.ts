import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { CreatePartyUseCase } from '@/modules/party/use-cases/create-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { partyFileList } from '../../../mocks/file.mock';
import { createPartyDTO, party } from '../../../mocks/party.mock';

describe('CreatePartyUseCase', () => {
   let useCase: CreatePartyUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;
   let fileRepository: IFileRepository;
   let uploadService: IUploadService;
   let environmentConfig: IEnvironmentConfigService;

   beforeEach(() => {
      logger = createMock<ILogger>({ log: jest.fn() });
      repository = createMock<IPartyRepository>({
         create: jest.fn(),
         findOne: jest.fn(),
      });
      fileRepository = createMock<IFileRepository>({ create: jest.fn() });
      uploadService = createMock<IUploadService>({ uploadFile: jest.fn() });
      environmentConfig = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });

      useCase = new CreatePartyUseCase(
         logger,
         repository,
         fileRepository,
         uploadService,
         environmentConfig,
      );
   });

   it('should create a party without files', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(party);

      const result = await useCase.execute(createPartyDTO);

      expect(logger.log).toHaveBeenCalledWith(
         'CreatePartyUseCases execute()',
         'New party have been created',
      );
      expect(result).toEqual(party);
   });

   it('should create a party with files and without cloud upload', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(party);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(false);

      const result = await useCase.execute(createPartyDTO, partyFileList);

      expect(fileRepository.create).toHaveBeenCalledTimes(partyFileList.length);
      expect(uploadService.uploadFile).not.toHaveBeenCalled();
      expect(result).toEqual(party);
   });

   it('should create a party with files and with cloud upload', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(party);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(true);
      jest
         .spyOn(uploadService, 'uploadFile')
         .mockResolvedValue({ url: 'uploadedFile' });

      const result = await useCase.execute(createPartyDTO, partyFileList);

      expect(fileRepository.create).toHaveBeenCalledTimes(partyFileList.length);
      expect(uploadService.uploadFile).toHaveBeenCalledTimes(
         partyFileList.length,
      );
      expect(result).toEqual(party);
   });
});
