import { PartyStatus } from '@/common/enums/statusParty.enum';
import { IEnvironmentConfigService } from '@/common/interfaces/abstracts/environmentConfigService.interface';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUploadService } from '@/common/interfaces/abstracts/upload.service';
import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { DeletePartyUseCase } from '@/modules/party/use-cases/delete-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { filePartyList } from '../../../mocks/file.mock';
import { party } from '../../../mocks/party.mock';

describe('DeletePartyUseCase', () => {
   let deletePartyUseCase: DeletePartyUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;
   let uploadService: IUploadService;
   let fileRepository: IFileRepository;
   let environmentConfig: IEnvironmentConfigService;

   beforeEach(() => {
      logger = createMock<ILogger>({ log: jest.fn() });
      repository = createMock<IPartyRepository>({
         findOne: jest.fn(),
         delete: jest.fn(),
      });
      uploadService = createMock<IUploadService>({ deleteFile: jest.fn() });
      fileRepository = createMock<IFileRepository>({ findAll: jest.fn() });
      environmentConfig = createMock<IEnvironmentConfigService>({
         getCloudUpload: jest.fn(),
      });

      deletePartyUseCase = new DeletePartyUseCase(
         logger,
         repository,
         uploadService,
         fileRepository,
         environmentConfig,
      );
   });

   it('should delete a party when it is not active', async () => {
      const inactive = { ...party, status: PartyStatus.INACTIVE };

      jest.spyOn(repository, 'findOne').mockResolvedValue(inactive);
      jest.spyOn(repository, 'delete').mockResolvedValue(inactive);
      jest.spyOn(fileRepository, 'findAll').mockResolvedValue([]);

      const result = await deletePartyUseCase.execute('1');

      expect(result).toEqual(inactive);

      expect(logger.log).toHaveBeenCalledWith(
         'DeletePartyUseCases execute()',
         'Party 1 have been deleted',
      );
   });

   it('should throw an exception when the party is active', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(party);

      await expect(deletePartyUseCase.execute('1')).rejects.toThrow(
         NotAcceptableException,
      );
   });

   it('should throw an exception when the party is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(deletePartyUseCase.execute('1')).rejects.toThrow(
         NotFoundException,
      );
   });

   it('should delete files when there are files to delete and cloud upload is enabled', async () => {
      jest.spyOn(fileRepository, 'findAll').mockResolvedValue(filePartyList);
      jest.spyOn(environmentConfig, 'getCloudUpload').mockReturnValue(true);

      await deletePartyUseCase['deleteFiles']('1');

      expect(uploadService.deleteFile).toHaveBeenCalledWith(['testKey']);
   });

   it('should not delete files when there are no files to delete', async () => {
      jest.spyOn(fileRepository, 'findAll').mockResolvedValue([]);

      await deletePartyUseCase['deleteFiles']('1');

      expect(uploadService.deleteFile).not.toHaveBeenCalled();
   });
});
