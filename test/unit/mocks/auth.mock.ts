import { AuthDTO, PermissionDTO } from '@/modules/auth/presenters/auth.dto';
import { AuthPresenter } from '@/modules/auth/presenters/auth.presenter';

export const authCredentials: AuthDTO = {
   email: 'test@test.com',
   password: 'hashedPassword',
};

export const authPresenter: AuthPresenter = {
   id: '1',
   email: 'test@test.com',
   username: 'John Doe',
   telephoneNumber: '123456789',
   accessToken: 'token',
   file: {
      url: 'testUrl',
      originalname: 'testOriginalname',
      fieldname: 'testKey',
   },
};

export const permissions: PermissionDTO = {
   pushNotificationToken: 'testToken',
}


