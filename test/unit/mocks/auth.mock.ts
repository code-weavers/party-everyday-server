import { AuthDTO } from '@/modules/auth/presenters/auth.dto';
import { AuthPresenter } from '@/modules/auth/presenters/auth.presenter';

export const authCredentials: AuthDTO = {
   email: 'test@test.com',
   password: 'hashedPassword',
};

export const authPresenter: AuthPresenter = {
   id: '1',
   email: 'test@test.com',
   username: 'John Doe',
   accessToken: 'token',
   file: {
      url: 'testUrl',
      originalname: 'testOriginalname',
      fieldname: 'testKey',
   },
};
