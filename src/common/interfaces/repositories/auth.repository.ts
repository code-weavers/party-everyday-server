import { User } from '@entities/user.entity';
import { AuthDTO } from '@modules/auth/presenters/auth.dto';
import { AuthPresenter } from '@modules/auth/presenters/auth.presenter';

export interface IAuthRepository {
   login?(credentials: AuthDTO): Promise<AuthPresenter>;

   validateUser?(
      email: string,
      password: string,
   ): Promise<Omit<User, 'password'>>;
}
