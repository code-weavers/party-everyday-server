import { IBcryptService } from '@/common/interfaces/abstracts/bcrypt.service';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { UpdateUserUseCase } from '@/modules/user/use-cases/update-user.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ForbiddenException } from '@nestjs/common';
import { updateUserDTO, user } from '../../../mocks/user.mock';

describe('UpdateUserUseCase', () => {
   let useCase: UpdateUserUseCase;
   let loggerService: ILogger;
   let userRepository: IUserRepository;
   let bcryptService: IBcryptService;

   beforeEach(() => {
      loggerService = createMock<ILogger>({
         log: jest.fn(),
      });
      userRepository = createMock<IUserRepository>({
         alreadyExists: jest.fn(),
         update: jest.fn(),
      });
      bcryptService = createMock<IBcryptService>({
         createHash: jest.fn(),
      });

      useCase = new UpdateUserUseCase(
         loggerService,
         userRepository,
         bcryptService,
      );
   });

   it('should throw ForbiddenException if email already exists', async () => {
      jest.spyOn(userRepository, 'alreadyExists').mockResolvedValue(true);

      await expect(useCase.execute('1', updateUserDTO)).rejects.toThrow(
         ForbiddenException,
      );

      expect(userRepository.alreadyExists).toHaveBeenCalledWith(
         'email',
         updateUserDTO.email,
         '1',
      );
   });

   it('should hash password if provided', async () => {
      jest.spyOn(userRepository, 'alreadyExists').mockResolvedValue(false);

      jest
         .spyOn(bcryptService, 'createHash')
         .mockResolvedValue('hashedPassword');

      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      await useCase.execute('1', updateUserDTO);

      expect(userRepository.update).toHaveBeenCalledWith('1', {
         ...updateUserDTO,
         password: 'hashedPassword',
      });
   });

   it('should not hash password if not provided', async () => {
      jest.spyOn(userRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      await useCase.execute('1', { ...updateUserDTO, password: undefined });

      expect(bcryptService.createHash).not.toHaveBeenCalled();
      expect(userRepository.update).toHaveBeenCalledWith('1', {
         ...updateUserDTO,
         password: undefined,
      });
   });

   it('should log the update', async () => {
      jest.spyOn(userRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      await useCase.execute('1', updateUserDTO);

      expect(loggerService.log).toHaveBeenCalledWith(
         'UpdateUserUseCases execute()',
         'User 1 have been updated',
      );
   });

   it('should return the updated user', async () => {
      jest.spyOn(userRepository, 'alreadyExists').mockResolvedValue(false);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);

      const result = await useCase.execute('1', updateUserDTO);

      expect(result).toEqual(user);
   });
});
