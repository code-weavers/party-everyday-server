import { FindAllUserUseCase } from '@/modules/user/use-cases/find-all-users.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { users } from '../../../mocks/user.mock';

describe('FindAllUserUseCase', () => {
   let findAllUserUseCase: FindAllUserUseCase;
   let mockUserRepository: IUserRepository;
   let mockCacheManager: ICacheManager = createMock<ICacheManager>();

   beforeEach(() => {
      mockUserRepository = createMock<IUserRepository>();
      mockCacheManager = createMock<ICacheManager>();
      findAllUserUseCase = new FindAllUserUseCase(
         mockUserRepository,
         mockCacheManager,
      );
   });

   it('should return cached users if they exist', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(users);

      const result = await findAllUserUseCase.execute();

      expect(result).toEqual(users);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('users');
      expect(mockUserRepository.findAll).not.toHaveBeenCalled();
   });

   it('should fetch users from repository and cache them if not in cache', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'findAll').mockResolvedValue(users);

      const result = await findAllUserUseCase.execute();

      expect(result).toEqual(users);
      expect(mockCacheManager.getCachedObject).toHaveBeenCalledWith('users');
      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(mockCacheManager.setObjectInCache).toHaveBeenCalledWith(
         'users',
         users,
      );
   });

   it('should return users fetched from repository', async () => {
      jest.spyOn(mockCacheManager, 'getCachedObject').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'findAll').mockResolvedValue(users);

      const result = await findAllUserUseCase.execute();

      expect(result).toEqual(users);
   });
});
