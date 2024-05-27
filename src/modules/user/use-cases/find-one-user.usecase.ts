import { User } from '@entities/user.entity';
import { ICacheManager } from '@interfaces/abstracts/cache.service';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

export class FindOneUserUseCase {
   constructor(
      private readonly repository: IUserRepository,
      private readonly cacheManager: ICacheManager,
   ) {}

   public async execute(id: string): Promise<User> {
      const cachedUser = await this.cacheManager.getCachedObject<User>('user');

      if (cachedUser && cachedUser.id === id) return cachedUser;

      const user: User = await this.repository.findOne(id);

      if (!user) throw new NotFoundException({ message: 'User not found' });

      await this.cacheManager.setObjectInCache('user', user);

      return user;
   }
}
