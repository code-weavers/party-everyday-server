import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { UpdatePartyFileUseCase } from '@/modules/party/use-cases/update-party-file.usecase';
import { createMock } from '@golevelup/ts-jest';
import {
   fileParty,
   filePartyList,
   partyFileList,
} from '../../../mocks/file.mock';
import { partyMock } from '../../../mocks/party.mock';

describe('UpdatePartyFileUseCase', () => {
   let updatePartyFileUseCase: UpdatePartyFileUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;
   let fileRepository: IFileRepository;
   let uploadService: IUploadService;
   let environmentConfig: IEnvironmentConfigService;

   beforeEach(() => {
      logger = createMock<ILogger>({
         log: jest.fn(),
      });
      repository = createMock<IPartyRepository>({
         findOne: jest.fn(),
         update: jest.fn(),
      });
      fileRepository = {
         findAll: jest.fn(),
         updateMany: jest.fn(),
         create: jest.fn(),
      };
      uploadService = {
         deleteFile: jest.fn(),
         uploadFile: jest.fn(),
      };
      environmentConfig = {
         getCloudUpload: jest.fn(),
      };

      updatePartyFileUseCase = new UpdatePartyFileUseCase(
         logger,
         repository,
         fileRepository,
         uploadService,
         environmentConfig,
      );
   });

   it('should update party files', async () => {
      const id = '1';

      jest
         .spyOn(fileRepository, 'findAll')
         .mockResolvedValueOnce(filePartyList);
      jest
         .spyOn(fileRepository, 'updateMany')
         .mockResolvedValueOnce(filePartyList);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(partyMock);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValueOnce(true);
      jest.spyOn(uploadService, 'uploadFile').mockResolvedValueOnce(fileParty);

      const result = await updatePartyFileUseCase.execute(id, partyFileList);

      expect(result).toEqual(partyMock);
      expect(logger.log).toHaveBeenCalledWith(
         'UpdatePartyFileUseCases execute()',
         `Files of ${partyMock.name} have been updated`,
      );
   });

   it('should create new party files if none exist', async () => {
      const id = '1';

      jest.spyOn(fileRepository, 'findAll').mockResolvedValueOnce(null);
      jest.spyOn(fileRepository, 'create').mockResolvedValueOnce(fileParty);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValueOnce(true);
      jest.spyOn(uploadService, 'uploadFile').mockResolvedValueOnce(fileParty);

      const result = await updatePartyFileUseCase['createOrUpdateFile'](
         id,
         partyFileList,
      );

      expect(result).toEqual(filePartyList);
   });
});
