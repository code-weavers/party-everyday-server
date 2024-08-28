import { PartyStatus } from '@/common/enums/statusParty.enum';
import { ICheckoutRepository } from '@/common/interfaces/repositories/checkout.repository';
import { FindOnePartyUseCase } from '@/modules/party/use-cases/find-one-party.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IPartyRepository } from '@interfaces/repositories/party.repository';
import { NotFoundException } from '@nestjs/common';
import { additionalInfosMock } from '../../../mocks/additionalInfo.mock';
import { partyMock } from '../../../mocks/party.mock';

describe('FindOnePartyUseCase', () => {
   let useCase: FindOnePartyUseCase;
   let repository: jest.Mocked<IPartyRepository>;
   let checkoutRepository: jest.Mocked<ICheckoutRepository>;
   let cacheManager: jest.Mocked<ICacheManager>;

   beforeEach(() => {
      repository = createMock<IPartyRepository>({ findOne: jest.fn() });
      checkoutRepository = createMock<ICheckoutRepository>({ findAll: jest.fn() });
      cacheManager = createMock<ICacheManager>({
         getCachedObject: jest.fn(),
         setObjectInCache: jest.fn(),
      });
      useCase = new FindOnePartyUseCase(repository, checkoutRepository, cacheManager);
   });

   it('should return the party from the cache if it exists', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(partyMock);

      const result = await useCase.execute('1');

      expect(result).toEqual(partyMock);
      expect(repository.findOne).not.toHaveBeenCalled();
   });

   it('should return the party from the repository if it is not in the cache', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(partyMock);

      const result = await useCase.execute('1');

      expect(result).toEqual(partyMock);
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith(
         'party-1',
         partyMock,
      );
   });

   it('should throw a NotFoundException if the party is not found', async () => {
      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);

      expect(cacheManager.getCachedObject).toHaveBeenCalledWith('party-1');
      expect(repository.findOne).toHaveBeenCalledWith('1');
   });

   it('should return the party with additional info if it is checked out', async () => {
      const checkedOutPartyMock = { ...partyMock, status: PartyStatus.CHECKED_OUT };

      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(checkedOutPartyMock);
      jest.spyOn(checkoutRepository, 'findAll').mockResolvedValue(additionalInfosMock);

      const result = await useCase.execute('1');

      expect(result).toEqual({ ...checkedOutPartyMock, additionalInfo: additionalInfosMock });
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(checkoutRepository.findAll).toHaveBeenCalledWith(checkedOutPartyMock.id);
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith('party-1', { ...checkedOutPartyMock, additionalInfo: additionalInfosMock });
   });

   it('should return the party without additional info if it is not checked out', async () => {
      const notCheckedOutPartyMock = { ...partyMock, status: PartyStatus.ACTIVE };

      jest.spyOn(cacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(notCheckedOutPartyMock);

      const result = await useCase.execute('1');

      expect(result).toEqual(notCheckedOutPartyMock);
      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(checkoutRepository.findAll).not.toHaveBeenCalled();
      expect(cacheManager.setObjectInCache).toHaveBeenCalledWith('party-1', notCheckedOutPartyMock);
   });
});
