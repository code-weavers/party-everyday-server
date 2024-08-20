import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IPartyRepository } from '@/common/interfaces/repositories/party.repository';
import { RemoveGuestUseCase } from '@/modules/party/use-cases/remove-guest.usecase';
import { createMock } from '@golevelup/ts-jest';
import { partyMock } from '../../../mocks/party.mock';

describe('RemoveGuestUseCase', () => {
   let removeGuestUseCase: RemoveGuestUseCase;
   let loggerMock: ILogger;
   let repositoryMock: IPartyRepository;

   beforeEach(() => {
      loggerMock = createMock<ILogger>({ log: jest.fn() });
      repositoryMock = createMock<IPartyRepository>({
         deleteGuest: jest.fn(),
      });

      removeGuestUseCase = new RemoveGuestUseCase(loggerMock, repositoryMock);
   });

   it('should call deleteGuest with the correct id', async () => {
      await removeGuestUseCase.execute('1');
      expect(repositoryMock.deleteGuest).toHaveBeenCalledWith('1');
   });

   it('should log the correct message after removing the guest', async () => {
      await removeGuestUseCase.execute('1');

      expect(loggerMock.log).toHaveBeenCalledWith(
         'RemoveGuestUseCase execute()',
         `Guest ${'1'} have been removed successfully`
      );
   });

   it('should return the removed guest', async () => {
      jest.spyOn(repositoryMock, 'deleteGuest').mockResolvedValueOnce(partyMock);

      const result = await removeGuestUseCase.execute('1');

      expect(result).toBe(partyMock);
   });
});