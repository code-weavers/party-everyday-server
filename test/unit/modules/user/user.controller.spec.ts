import { FileUtils } from '@/common/utils/file.utils';
import { User } from '@/entities/user.entity';
import { UpdateUserDTO } from '@/modules/user/presenters/user.dto';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';
import { UserController } from '@/modules/user/user.controller';
import { UserModule } from '@/modules/user/user.module';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { multerFile } from '../../mocks/file.mock';
import { createUserDTO, user, userWithFile } from '../../mocks/user.mock';

describe('UserController', () => {
   let userController: UserController;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         controllers: [UserController],
         providers: [
            {
               provide: UserModule.GET_USERS_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: UserModule.GET_USER_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: UserModule.CREATE_USER_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: UserModule.UPDATE_USER_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: UserModule.UPDATE_USER_FILE_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
            {
               provide: UserModule.DELETE_USER_USECASES_PROXY,
               useValue: createMock({
                  getInstance: jest.fn().mockReturnThis(),
                  execute: jest.fn(),
               }),
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      userController = module.get<UserController>(UserController);
   });

   it('should be defined', () => {
      expect(userController).toBeDefined();
   });

   describe('findUser', () => {
      it('should find a user using the findUser method', async () => {
         const mockUser = new User();
         const mockReq = { user: { id: '1', username: '' } };

         jest
            .spyOn(
               userController['findOneUserUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockUser);

         const result = await userController.findUser(mockReq);

         expect(result).toBeInstanceOf(UserPresenter);

         expect(
            userController['findOneUserUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockReq.user.id);
      });
   });

   describe('findOneUser', () => {
      it('should find one user using the findOneUser method', async () => {
         const mockUser = new User();
         const mockId = '1';

         jest
            .spyOn(
               userController['findOneUserUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockUser);

         const result = await userController.findOneUser(mockId);

         expect(result).toBeInstanceOf(UserPresenter);

         expect(
            userController['findOneUserUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId);
      });
   });

   describe('findAllUser', () => {
      it('should find all users using the findAllUser method', async () => {
         const mockUsers = [new User(), new User()];
         const mockUserPresenters = mockUsers.map(
            (user) => new UserPresenter(user),
         );

         jest
            .spyOn(
               userController['findAllUserUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(mockUsers);

         const result = await userController.findAllUser();

         expect(result).toEqual(mockUserPresenters);
         expect(
            userController['findAllUserUseCase'].getInstance().execute,
         ).toHaveBeenCalled();
      });
   });

   describe('createUser', () => {
      it('should create a user', async () => {
         const mockUser = new UserPresenter(user);
         const mockFile = multerFile;

         jest
            .spyOn(userController['createUserUseCase'].getInstance(), 'execute')
            .mockResolvedValue(mockUser);

         jest.spyOn(FileUtils, 'createFile').mockResolvedValue(mockFile);

         const result = await userController.createUser(
            createUserDTO,
            mockFile,
         );

         expect(result).toBeInstanceOf(UserPresenter);
         expect(
            userController['createUserUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(createUserDTO, mockFile);
      });
   });

   describe('updateUser', () => {
      it('should update a user', async () => {
         const mockUser = new User();
         const mockId = '1';
         const mockUpdateUserDTO: UpdateUserDTO = {
            username: 'updatedUser',
            password: 'updatedPassword',
         };

         jest
            .spyOn(userController['updateUserUseCase'].getInstance(), 'execute')
            .mockResolvedValue(mockUser);

         const result = await userController.updateUser(
            mockId,
            mockUpdateUserDTO,
         );

         expect(result).toBeInstanceOf(UserPresenter);

         expect(
            userController['updateUserUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId, mockUpdateUserDTO);
      });
   });

   describe('updateUserFile', () => {
      it('should update a user file', async () => {
         const mockId = '1';

         jest
            .spyOn(
               userController['updateUserFileUseCase'].getInstance(),
               'execute',
            )
            .mockResolvedValue(userWithFile);

         const result = await userController.updateUserFile(mockId, multerFile);

         expect(result).toBeInstanceOf(UserPresenter);

         expect(
            userController['updateUserFileUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId, multerFile);
      });
   });

   describe('deleteUser', () => {
      it('should delete a user', async () => {
         const mockUser = new User();
         const mockId = '1';

         jest
            .spyOn(userController['deleteUserUseCase'].getInstance(), 'execute')
            .mockResolvedValue(mockUser);

         const result = await userController.deleteUser(mockId);

         expect(result).toBeInstanceOf(UserPresenter);
         expect(
            userController['deleteUserUseCase'].getInstance().execute,
         ).toHaveBeenCalledWith(mockId);
      });
   });
});
