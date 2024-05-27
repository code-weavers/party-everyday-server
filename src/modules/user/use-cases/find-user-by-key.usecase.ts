import { User } from '@entities/user.entity';
import { IUserRepository } from '@interfaces/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

export class FindUserByKeyUseCase {
   constructor(private readonly repository: IUserRepository) {}

   public async execute(key: string, value: string): Promise<User> {
      const user: User = await this.repository.findByKey(key, value);

      if (!user) throw new NotFoundException({ message: 'User not found' });

      return user;
   }
}
