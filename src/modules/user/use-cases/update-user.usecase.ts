import { User } from '@entities/user.entity';
import { IBcryptService } from '@interfaces/abstracts/bcrypt.service';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { UpdateUserDTO } from '../presenters/user.dto';

export class UpdateUserUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly repository: IUserRepository,
      private readonly bcryptService: IBcryptService,
   ) {}

   public async execute(id: string, user: UpdateUserDTO): Promise<User> {
      if (await this.repository.alreadyExists('email', user.email, id))
         throw new ForbiddenException({
            message: 'Email already exists in app!',
            statusCode: HttpStatus.FORBIDDEN,
         });

      if (user.password) {
         user.password = await this.bcryptService.createHash(user.password);
      } else {
         delete user.password;
      }

      const updatedUser = await this.repository.update(id, user);

      this.logger.log(
         'UpdateUserUseCases execute()',
         `User ${id} have been updated`,
      );

      return updatedUser;
   }
}
