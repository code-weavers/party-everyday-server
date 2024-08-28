import { IAuth } from '@/common/interfaces/auth.interface';
import { Public } from '@decorators/isPublicRoute.decorator';
import { Body, Controller, Inject, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseCaseProxy } from '@utils/usecase-proxy';
import { PostApiResponse } from '../../common/decorators/requests/postApiResponse.decorator';
import { UserPresenter } from '../user/presenters/user.presenter';
import { AuthModule } from './auth.module';
import { AuthDTO, PermissionDTO } from './presenters/auth.dto';
import { AuthPresenter } from './presenters/auth.presenter';
import { LoginUseCase } from './use-cases/login.usecase';
import { PermissionUseCase } from './use-cases/permission.usecase';

@ApiTags('Authentication')
@Controller('public/auth')
export class AuthController {
   constructor(
      @Inject(AuthModule.LOGIN_USECASES_PROXY)
      private readonly loginUseCase: UseCaseProxy<LoginUseCase>,
      @Inject(AuthModule.PERMISSION_USECASES_PROXY)
      private readonly permissionUseCase: UseCaseProxy<PermissionUseCase>,
   ) { }

   @Public()
   @PostApiResponse(AuthPresenter, 'login', false)
   public async login(
      @Body() authCredentials: AuthDTO,
   ): Promise<AuthPresenter> {
      const credentials = new AuthDTO(authCredentials);
      return this.loginUseCase.getInstance().execute(credentials);
   }

   @PostApiResponse(UserPresenter, 'permission', false)
   public async setPermissions(
      @Req() req: IAuth,
      @Body() permissions: PermissionDTO,
   ): Promise<UserPresenter> {
      return this.permissionUseCase.getInstance().execute(req.user.id, permissions);
   }
}
