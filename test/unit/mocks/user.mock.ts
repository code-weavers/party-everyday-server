import { OwnerType } from '@/common/enums/ownerType.enum';
import { User } from '@/entities/user.entity';
import {
   CreateUserDTO,
   UpdateUserDTO,
} from '@/modules/user/presenters/user.dto';

export const user: User = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   createdAt: new Date(),
   updatedAt: new Date(),
};

export const userWithFile: User = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   file: {
      id: '1',
      ownerId: '1',
      ownerType: OwnerType.USER,
      originalname: 'testOriginalname',
      key: 'testKey',
      url: 'testUrl',
   },
   createdAt: new Date(),
   updatedAt: new Date(),
};

export const userWithoutDates = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   file: {
      id: '1',
      ownerId: '1',
      ownerType: OwnerType.USER,
      originalname: 'testOriginalname',
      key: 'testKey',
      url: 'testUrl',
   },
};

export const users: User[] = [
   {
      id: '1',
      username: 'John Doe',
      email: 'test@test.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
];

export const createUserDTO: CreateUserDTO = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
};

export const updateUserDTO: UpdateUserDTO = {
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
};
