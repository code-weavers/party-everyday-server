import { User } from '@/entities/user.entity';
import { ILogger } from '@interfaces/abstracts/logger.interface';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { PermissionDTO } from '../presenters/auth.dto';

export class PermissionUseCase {
   constructor(
      private readonly logger: ILogger,
      private readonly userRepository: IUserRepository,
   ) { }

   public async execute(userId: string, permissions: PermissionDTO): Promise<User> {
      this.logger.log(`PermissionUseCase execute()`, `Setting permissions for user with id: ${userId}`);

      await this.userRepository.update(userId, {
         pushNotificationToken: permissions.pushNotificationToken,
      });

      this.logger.log(`PermissionUseCase execute()`, `Permissions have setted!`);

      const user = await this.userRepository.findOne(userId);

      return user;
   }
}
