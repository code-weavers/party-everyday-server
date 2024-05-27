import { FindUserByKeyUseCase } from '@/modules/user/use-cases/find-user-by-key.usecase';
import { createMock } from '@golevelup/ts-jest';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { user } from '../../../mocks/user.mock';

describe('FindUserByKeyUseCase', () => {
   let findUserByKeyUseCase: FindUserByKeyUseCase;
   let mockUserRepository: IUserRepository;

   beforeEach(() => {
      mockUserRepository = createMock<IUserRepository>();
      findUserByKeyUseCase = new FindUserByKeyUseCase(mockUserRepository);
   });

   it('should fetch user from repository and cache them if not in cache', async () => {
      jest.spyOn(mockUserRepository, 'findByKey').mockResolvedValue(user);

      const result = await findUserByKeyUseCase.execute('name', 'John Doe');

      expect(result).toEqual(user);

      expect(mockUserRepository.findByKey).toHaveBeenCalled();
   });

   it('should return user fetched from repository', async () => {
      jest.spyOn(mockUserRepository, 'findByKey').mockResolvedValue(user);

      const result = await findUserByKeyUseCase.execute('name', 'John Doe');

      expect(result).toEqual(user);
   });

   it('should throw NotFoundException when user is not found', async () => {
      jest.spyOn(mockUserRepository, 'findByKey').mockResolvedValue(null);

      await expect(
         findUserByKeyUseCase.execute('name', 'John Doe'),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findByKey).toHaveBeenCalledWith(
         'name',
         'John Doe',
      );
   });

   it('should return user when user is found', async () => {
      jest.spyOn(mockUserRepository, 'findByKey').mockResolvedValue(user);

      const result = await findUserByKeyUseCase.execute('name', 'John Doe');

      expect(result).toEqual(user);
      expect(mockUserRepository.findByKey).toHaveBeenCalledWith(
         'name',
         'John Doe',
      );
   });
});
