import { DeleteApiResponse } from '@/common/decorators/requests/deleteApiResponse.decorator';
import { GetApiResponse } from '@/common/decorators/requests/getApiResponse.decorator';
import { PostApiResponse } from '@/common/decorators/requests/postApiResponse.decorator';
import { PutApiResponse } from '@/common/decorators/requests/putApiResponse.decorator';
import { Public } from '@decorators/isPublicRoute.decorator';
import { IAuth } from '@interfaces/auth.interface';
import { HttpCode, Inject } from '@nestjs/common';
import {
   Body,
   Controller,
   Param,
   Req,
   UploadedFile,
   UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileUtils } from '@utils/file.utils';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { CreateFileDTO } from '../file/presenters/file.dto';
import { CreateUserDTO, UpdateUserDTO } from './presenters/user.dto';
import { UserPresenter } from './presenters/user.presenter';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DeleteUserUseCase } from './use-cases/delete-user.usecase';
import { FindAllUserUseCase } from './use-cases/find-all-users.usecase';
import { FindOneUserUseCase } from './use-cases/find-one-user.usecase';
import { UpdateUserFileUseCase } from './use-cases/update-user-file.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { UserModule } from './user.module';

@ApiTags('Users')
@Controller('users')
export class UserController {
   constructor(
      @Inject(UserModule.GET_USERS_USECASES_PROXY)
      private readonly findAllUserUseCase: UseCaseProxy<FindAllUserUseCase>,
      @Inject(UserModule.GET_USER_USECASES_PROXY)
      private readonly findOneUserUseCase: UseCaseProxy<FindOneUserUseCase>,
      @Inject(UserModule.CREATE_USER_USECASES_PROXY)
      private readonly createUserUseCase: UseCaseProxy<CreateUserUseCase>,
      @Inject(UserModule.UPDATE_USER_USECASES_PROXY)
      private readonly updateUserUseCase: UseCaseProxy<UpdateUserUseCase>,
      @Inject(UserModule.UPDATE_USER_FILE_USECASES_PROXY)
      private readonly updateUserFileUseCase: UseCaseProxy<UpdateUserFileUseCase>,
      @Inject(UserModule.DELETE_USER_USECASES_PROXY)
      private readonly deleteUserUseCase: UseCaseProxy<DeleteUserUseCase>,
   ) {}

   @GetApiResponse(UserPresenter, '/me')
   public async findUser(@Req() req: IAuth): Promise<UserPresenter> {
      const user = await this.findOneUserUseCase
         .getInstance()
         .execute(req.user.id);

      return new UserPresenter(user);
   }

   @GetApiResponse(UserPresenter, ':id')
   public async findOneUser(@Param('id') id: string): Promise<UserPresenter> {
      const user = await this.findOneUserUseCase.getInstance().execute(id);

      return new UserPresenter(user);
   }

   @GetApiResponse(UserPresenter)
   public async findAllUser(): Promise<UserPresenter[]> {
      const users = await this.findAllUserUseCase.getInstance().execute();
      return users.map((user) => new UserPresenter(user));
   }

   @Public()
   @PostApiResponse(UserPresenter, '', false)
   @UseInterceptors(FileInterceptor('files'))
   public async createUser(
      @Body() user: CreateUserDTO,
      @UploadedFile() file: Express.Multer.File,
   ): Promise<UserPresenter> {
      const newFile: CreateFileDTO = await FileUtils.createFile(file);

      return await this.createUserUseCase.getInstance().execute(user, newFile);
   }

   @PutApiResponse(UserPresenter, '/:id')
   public async updateUser(
      @Param('id') id: string,
      @Body() user: UpdateUserDTO,
   ): Promise<UserPresenter> {
      const updatedUser = await this.updateUserUseCase
         .getInstance()
         .execute(id, user);

      return new UserPresenter(updatedUser);
   }

   @PutApiResponse(UserPresenter, '/:id/avatar')
   @UseInterceptors(FileInterceptor('file'))
   public async updateUserFile(
      @Param('id') id: string,
      @UploadedFile() file: Express.Multer.File,
   ): Promise<UserPresenter> {
      const newFile: CreateFileDTO = await FileUtils.createFile(file);
      const updatedUser = await this.updateUserFileUseCase
         .getInstance()
         .execute(id, newFile);

      return new UserPresenter(updatedUser);
   }

   @HttpCode(204)
   @DeleteApiResponse('/:id')
   public async deleteUser(@Param('id') id: string): Promise<UserPresenter> {
      const deletedUser = await this.deleteUserUseCase
         .getInstance()
         .execute(id);

      return new UserPresenter(deletedUser);
   }
}
