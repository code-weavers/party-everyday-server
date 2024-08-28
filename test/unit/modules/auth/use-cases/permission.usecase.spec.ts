import { PermissionDTO } from '@/modules/auth/presenters/auth.dto';
import { PermissionUseCase } from '@/modules/auth/use-cases/permission.usecase';
import { createMock } from '@golevelup/ts-jest';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { user } from '../../../mocks/user.mock';

describe('PermissionUseCase', () => {
   let permissionUseCase: PermissionUseCase;
   let logger: ILogger;
   let userRepository: IUserRepository;

   beforeEach(() => {
      logger = createMock<ILogger>({ log: jest.fn() });
      userRepository = createMock<IUserRepository>({ findOne: jest.fn(), update: jest.fn() });

      permissionUseCase = new PermissionUseCase(logger, userRepository);
   });

   it('should log the start and end of the execute method', async () => {
      const userId = '123';
      const permissions: PermissionDTO = { pushNotificationToken: 'token' };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      await permissionUseCase.execute(userId, permissions);

      expect(logger.log).toHaveBeenCalledWith('PermissionUseCase execute()', `Setting permissions for user with id: ${userId}`);
      expect(logger.log).toHaveBeenCalledWith('PermissionUseCase execute()', 'Permissions have setted!');
   });

   it('should call userRepository.update with correct parameters', async () => {
      const userId = '123';
      const permissions: PermissionDTO = { pushNotificationToken: 'token' };

      await permissionUseCase.execute(userId, permissions);

      expect(userRepository.update).toHaveBeenCalledWith(userId, { pushNotificationToken: permissions.pushNotificationToken });
   });

   it('should call userRepository.findOne with correct userId', async () => {
      const userId = '123';
      const permissions: PermissionDTO = { pushNotificationToken: 'token' };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);

      const result = await permissionUseCase.execute(userId, permissions);

      expect(userRepository.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
   });
});