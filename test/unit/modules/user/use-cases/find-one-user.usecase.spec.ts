import { FindOneUserUseCase } from '@/modules/user/use-cases/find-one-user.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { user } from '../../../mocks/user.mock';

describe('FindOneUserUseCase', () => {
   let findOneUserUseCase: FindOneUserUseCase;
   let mockUserRepository: IUserRepository;
   let mockCacheManager: ICacheManager;

   beforeEach(() => {
      mockUserRepository = createMock<IUserRepository>();
      mockCacheManager = createMock<ICacheManager>();
      findOneUserUseCase = new FindOneUserUseCase(
         mockUserRepository,
         mockCacheManager,
      );
   });

   it('should return cached user if they exist', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(user);

      const result = await findOneUserUseCase.execute('1');

      expect(result).toEqual(user);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('user');
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
   });

   it('should fetch user from repository and cache them if not in cache', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);

      const result = await findOneUserUseCase.execute('1');

      expect(result).toEqual(user);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('user');
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockCacheManager.setObjectInCache).toHaveBeenCalledWith(
         'user',
         user,
      );
   });

   it('should return user fetched from repository', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);

      const result = await findOneUserUseCase.execute('1');

      expect(result).toEqual(user);
   });

   it('should throw NotFoundException when user is not in cache and repository', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      await expect(findOneUserUseCase.execute('1')).rejects.toThrow(
         NotFoundException,
      );
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('user');
      expect(mockUserRepository.findOne).toHaveBeenCalled();
   });

   it('should return cached user if their id matches the requested id', async () => {
      const userWithMatchingId = { ...user, id: '1' };
      jest
         .spyOn(mockCacheManager, 'getCachedObject')
         .mockResolvedValue(userWithMatchingId);

      const result = await findOneUserUseCase.execute('1');

      expect(result).toEqual(userWithMatchingId);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('user');
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
   });

   it('should not return cached user if their id does not match the requested id', async () => {
      const userWithDifferentId = { ...user, id: '2' };
      jest
         .spyOn(mockCacheManager, 'getCachedObject')
         .mockResolvedValue(userWithDifferentId);
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);

      const result = await findOneUserUseCase.execute('1');

      expect(result).toEqual(user);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('user');
      expect(mockUserRepository.findOne).toHaveBeenCalled();
   });
});
