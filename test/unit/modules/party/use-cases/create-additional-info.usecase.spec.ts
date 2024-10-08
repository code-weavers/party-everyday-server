import { CreateAdditionalInfoDTO } from '@/modules/party/presenters/party.dto';
import { CreateAdditionalInfoUseCase } from '@/modules/party/use-cases/create-additional-info.usecase';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { createAdditionalInfoMock } from '../../../mocks/additionalInfo.mock';
import { partyWithAdditionalInfoMock } from '../../../mocks/party.mock';

describe('CreateAdditionalInfoUseCase', () => {
   let useCase: CreateAdditionalInfoUseCase;
   let logger: ILogger;
   let repository: IPartyRepository;

   beforeEach(() => {
      logger = {
         log: jest.fn(),
      } as unknown as ILogger;

      repository = {
         createAdditionalInfo: jest.fn(),
      } as unknown as IPartyRepository;

      useCase = new CreateAdditionalInfoUseCase(logger, repository);
   });

   it('should log the start and end of the execution', async () => {
      const additionalPartyInfo: CreateAdditionalInfoDTO = createAdditionalInfoMock;

      jest.spyOn(repository, 'createAdditionalInfo').mockResolvedValue(partyWithAdditionalInfoMock);

      await useCase.execute('1', additionalPartyInfo);

      expect(logger.log).toHaveBeenCalledWith(
         'CreateAdditionalInfoUseCase execute()',
         'New additional info have been created'
      );
   });

   it('should call repository.createAdditionalInfo with correct parameters', async () => {
      const additionalPartyInfo: CreateAdditionalInfoDTO = createAdditionalInfoMock

      jest.spyOn(repository, 'createAdditionalInfo').mockResolvedValue(partyWithAdditionalInfoMock);

      const result = await useCase.execute('1', additionalPartyInfo);

      expect(repository.createAdditionalInfo).toHaveBeenCalledWith('1', additionalPartyInfo);
      expect(result).toBe(partyWithAdditionalInfoMock);
   });
});