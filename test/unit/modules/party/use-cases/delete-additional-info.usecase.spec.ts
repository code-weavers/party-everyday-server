import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { DeleteAdditionalInfoUseCase } from '@/modules/party/use-cases/delete-additional-info.usecase';
import { createMock } from '@golevelup/ts-jest';
import { partyMock } from '../../../mocks/party.mock';

describe('DeleteAdditionalInfoUseCase', () => {
   let useCase: DeleteAdditionalInfoUseCase;
   let loggerMock: ILogger;
   let repositoryMock: IPartyRepository;

   beforeEach(() => {
      loggerMock = createMock<ILogger>({ log: jest.fn() });

      repositoryMock = createMock<IPartyRepository>({
         deleteAdditionalInfo: jest.fn(),
      });

      useCase = new DeleteAdditionalInfoUseCase(loggerMock, repositoryMock);
   });

   it('should call repository.deleteAdditionalInfo with correct ID', async () => {
      await useCase.execute('123');
      expect(repositoryMock.deleteAdditionalInfo).toHaveBeenCalledWith('123');
   });

   it('should call logger.log with correct parameters', async () => {
      await useCase.execute('123');

      expect(loggerMock.log).toHaveBeenCalledWith(
         'DeleteAdditionalInfoUseCase execute()',
         `Party Additional Info ${'123'} have been deleted`,
      );
   });

   it('should return the deleted party', async () => {
      jest.spyOn(repositoryMock, 'deleteAdditionalInfo').mockResolvedValueOnce(partyMock);

      const result = await useCase.execute('1');

      expect(result).toBe(partyMock);
   });
});