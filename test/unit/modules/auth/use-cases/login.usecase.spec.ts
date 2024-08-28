import { IJwtService } from '@/common/interfaces/abstracts/jwt.service';
import { ILogger } from '@/common/interfaces/abstracts/logger.interface';
import { AuthDTO } from '@/modules/auth/presenters/auth.dto';
import { LoginUseCase } from '@/modules/auth/use-cases/login.usecase';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { IBcryptService } from '../../../../../src/common/interfaces/abstracts/bcrypt.service';
import { IUserRepository } from '../../../../../src/common/interfaces/repositories/user.repository';
import { UserRepository } from '../../../../../src/modules/user/user.repository';
import { authPresenter } from '../../../mocks/auth.mock';
import { userWithFile } from '../../../mocks/user.mock';

describe('LoginUseCase', () => {
   let useCase: LoginUseCase;
   let bcryptService: IBcryptService;
   let userRepository: IUserRepository;
   let logger: ILogger;
   let jwtService: IJwtService;

   beforeEach(async () => {
      userRepository = createMock<UserRepository>({
         findByKey: jest.fn(),
      });
      bcryptService = createMock<IBcryptService>({
         checkHash: jest.fn(),
      });
      logger = createMock<ILogger>({
         log: jest.fn(),
      });
      jwtService = createMock<IJwtService>({
         createToken: jest.fn(),
      });

      useCase = new LoginUseCase(
         logger,
         jwtService,
         bcryptService,
         userRepository,
      );
   });

   it('should be defined', () => {
      expect(userRepository).toBeDefined();
   });

   describe('execute', () => {
      it('should throw NotFoundException when user is not found', async () => {
         const credentials: AuthDTO = {
            email: 'test@test.com',
            password: 'password',
         };

         jest.spyOn(useCase, 'validateUser').mockResolvedValue(null);

         await expect(useCase.execute(credentials)).rejects.toThrow(
            NotFoundException,
         );
      });

      it('should throw NotFoundException when password does not match', async () => {
         const credentials: AuthDTO = {
            email: 'test@test.com',
            password: 'wrongpassword',
         };

         jest.spyOn(useCase, 'validateUser').mockImplementation(() => {
            throw new NotFoundException();
         });

         await expect(useCase.execute(credentials)).rejects.toThrow(
            NotFoundException,
         );
      });

      it('should return AuthPresenter when user is found and password matches', async () => {
         const credentials: AuthDTO = {
            email: 'test@test.com',
            password: 'hashedPassword',
         };

         jest.spyOn(useCase, 'validateUser').mockResolvedValue(userWithFile);
         jest.spyOn(jwtService, 'createToken').mockReturnValue('token');

         const result = await useCase.execute(credentials);

         expect(result).toEqual({
            id: authPresenter.id,
            email: authPresenter.email,
            username: authPresenter.username,
            telephoneNumber: authPresenter.telephoneNumber,
            pushNotificationToken: authPresenter.pushNotificationToken,
            billingAccountKey: authPresenter.billingAccountKey,
            file: authPresenter.file,
            accessToken: 'token',
         });
      });

      it('should call logger.log when user is found and password matches', async () => {
         const credentials: AuthDTO = {
            email: 'test@test.com',
            password: 'password',
         };

         jest.spyOn(useCase, 'validateUser').mockResolvedValue(userWithFile);
         jest.spyOn(jwtService, 'createToken').mockReturnValue('token');

         await useCase.execute(credentials);

         expect(logger.log).toHaveBeenCalledWith(
            'LoginUseCases execute()',
            'User have been logged in!',
         );
      });
   });

   describe('validateUser', () => {
      it('should throw NotFoundException when user is not found', async () => {
         const email = 'test@test.com';
         const password = 'password';

         jest.spyOn(userRepository, 'findByKey').mockResolvedValue(null);

         try {
            await useCase.validateUser(email, password);
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
         }
      });

      it('should throw NotFoundException when password does not match', async () => {
         const email = 'test@test.com';
         const password = 'wrongpassword';

         jest
            .spyOn(userRepository, 'findByKey')
            .mockResolvedValue(userWithFile);
         jest.spyOn(bcryptService, 'checkHash').mockResolvedValue(false);

         try {
            await useCase.validateUser(email, password);
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
         }
      });

      it('should return user data when user is found and password matches', async () => {
         const email = 'test@test.com';
         const password = 'hashedPassword';

         jest
            .spyOn(userRepository, 'findByKey')
            .mockResolvedValue(userWithFile);

         jest.spyOn(bcryptService, 'checkHash').mockResolvedValue(true);

         const result = await useCase.validateUser(email, password);

         expect(result).toEqual({
            id: userWithFile.id,
            email: userWithFile.email,
            username: userWithFile.username,
            telephoneNumber: userWithFile.telephoneNumber,
            billingAccountKey: userWithFile.billingAccountKey,
            pushNotificationToken: userWithFile.pushNotificationToken,
            file: userWithFile.file,
         });
      });
   });
});
