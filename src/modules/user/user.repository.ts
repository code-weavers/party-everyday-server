import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { User } from '@/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './presenters/user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
   constructor(
      @InjectRepository(User)
      private readonly repository: Repository<User>,
   ) {}

   public async findByKey(key: string, value: string): Promise<User> {
      return await this.repository.findOne({
         where: { [key]: value },
         relations: ['file'],
      });
   }

   public async findAll(): Promise<User[]> {
      return this.repository.find({
         relations: ['file'],
      });
   }

   public async findOne(id: string): Promise<User> {
      return await this.repository.findOne({
         where: { id },
         relations: ['file'],
      });
   }

   public async create(user: CreateUserDTO): Promise<User> {
      const newUser = this.repository.create(user);
      return this.repository.save(newUser);
   }

   public async update(id: string, user: User): Promise<User> {
      return this.repository.save({ ...user, id });
   }

   public async delete(id: string): Promise<User> {
      const user = await this.repository.findOne({ where: { id } });

      if (user) {
         this.repository.delete(id);
         return user;
      }
   }

   public async alreadyExists(
      key: string,
      value: string,
      id?: string,
   ): Promise<boolean> {
      if (!value) return false;

      const alreadyExists: User = await this.repository.findOne({
         where: { [key]: value },
      });

      if (alreadyExists && alreadyExists.id !== id) return true;

      return false;
   }
}
