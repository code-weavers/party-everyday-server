import { User } from '@/entities/user.entity';
import { IBcryptService } from '@interfaces/abstracts/bcrypt.service';
import { IJwtService } from '@interfaces/abstracts/jwt.service';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthDTO } from '../presenters/auth.dto';
import { AuthPresenter } from '../presenters/auth.presenter';

export class LoginUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly jwtService: IJwtService,
      private readonly bcryptService: IBcryptService,
      private readonly userRepository: IUserRepository,
   ) {}

   public async execute(credentials: AuthDTO): Promise<AuthPresenter> {
      const userValidated: Omit<User, 'password' | 'createdAt' | 'updatedAt'> =
         await this.validateUser(credentials.email, credentials.password);

      if (!userValidated)
         throw new NotFoundException({
            message: 'User not found!',
            status: HttpStatus.NOT_FOUND,
         });

      const accessToken = this.jwtService.createToken({ id: userValidated.id });

      this.logger.log(`LoginUseCases execute()`, `User have been logged in!`);

      return new AuthPresenter({
         id: userValidated.id,
         email: userValidated.email,
         username: userValidated.username,
         file: userValidated.file,
         accessToken,
      });
   }

   public async validateUser(
      email: string,
      password: string,
   ): Promise<Omit<User, 'password' | 'createdAt' | 'updatedAt'>> {
      const user = await this.userRepository.findByKey('email', email);

      if (!user)
         throw new NotFoundException({
            message: 'User not found!',
            status: HttpStatus.NOT_FOUND,
         });

      const isValidPassword = await this.bcryptService.checkHash(
         password,
         user.password,
      );

      if (isValidPassword) {
         delete user.password;
         delete user.createdAt;
         delete user.updatedAt;

         return user;
      }
   }
}
