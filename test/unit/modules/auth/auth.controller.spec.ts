import { IAuth } from '@/common/interfaces/auth.interface';
import { UseCaseProxy } from '@/common/utils/usecase-proxy';
import { AuthModule } from '@/modules/auth/auth.module';
import { AuthDTO } from '@/modules/auth/presenters/auth.dto';
import { PermissionUseCase } from '@/modules/auth/use-cases/permission.usecase';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthController } from '../../../../src/modules/auth/auth.controller';
import { LoginUseCase } from '../../../../src/modules/auth/use-cases/login.usecase';
import { authCredentials, authPresenter, permissions } from '../../mocks/auth.mock';
import { userPresenterMock, userWithoutPassword } from '../../mocks/user.mock';

describe('AuthController', () => {
   let controller: AuthController;
   let loginUseCase: UseCaseProxy<LoginUseCase>;
   let permissionUseCase: UseCaseProxy<PermissionUseCase>;

   beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [
            {
               provide: AuthModule.LOGIN_USECASES_PROXY,
               useValue: createMock({
                  getInstance: () => ({
                     execute: jest.fn().mockReturnValue(authPresenter),
                  }),
               }),
            },
            {
               provide: AuthModule.PERMISSION_USECASES_PROXY,
               useValue: createMock({
                  getInstance: () => ({
                     execute: jest.fn().mockReturnValue(userPresenterMock),
                  }),
               }),
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      controller = moduleRef.get<AuthController>(AuthController);
      loginUseCase = moduleRef.get<UseCaseProxy<LoginUseCase>>(
         AuthModule.LOGIN_USECASES_PROXY,
      );
      permissionUseCase = moduleRef.get<UseCaseProxy<PermissionUseCase>>(
         AuthModule.PERMISSION_USECASES_PROXY,
      );
   });

   it('should be defined', () => {
      expect(controller).toBeDefined();
      expect(loginUseCase).toBeDefined();
   });

   describe('login', () => {
      const mockAuthDTO = new AuthDTO(authCredentials);
      const mockAuthPresenter = authPresenter;

      it('should return the result of login when called with valid credentials', async () => {
         jest
            .spyOn(loginUseCase.getInstance(), 'execute')
            .mockResolvedValue(mockAuthPresenter);

         const result = await controller.login(mockAuthDTO);

         expect(result).toBe(mockAuthPresenter);
      });

      it('should throw an error when called with invalid credentials', async () => {
         jest
            .spyOn(loginUseCase.getInstance(), 'execute')
            .mockResolvedValue(null);

         try {
            await controller.login(mockAuthDTO);
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
         }
      });
   });

   describe('setPermissions', () => {
      const mockUserPresenter = new UserPresenter(userWithoutPassword);
      const mockRequest = { user: { id: '1' } } as IAuth;

      it('should return the result of setPermissions when called with valid data', async () => {
         jest
            .spyOn(permissionUseCase.getInstance(), 'execute')
            .mockResolvedValue(userWithoutPassword);

         const result = await controller.setPermissions(mockRequest, permissions);

         expect(result).toBe(userPresenterMock);
      });

      it('should throw an error when called with invalid data', async () => {
         jest
            .spyOn(permissionUseCase.getInstance(), 'execute')
            .mockResolvedValue(null);

         try {
            await controller.setPermissions(mockRequest, permissions);
         } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
         }
      });
   });
});
