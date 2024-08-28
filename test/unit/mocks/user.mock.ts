import { OwnerType } from '@/common/enums/ownerType.enum';
import { User } from '@/entities/user.entity';
import {
   CreateUserDTO,
   UpdateUserDTO,
} from '@/modules/user/presenters/user.dto';
import { UserPresenter } from '@/modules/user/presenters/user.presenter';

export const user: User = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   telephoneNumber: '123456789',
   billingAccountKey: 'testBilling',
   pushNotificationToken: 'testToken',
   createdAt: new Date(),
   updatedAt: new Date(),
};

export const userWithoutPassword: User = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   telephoneNumber: '123456789',
   billingAccountKey: 'testBilling',
   pushNotificationToken: 'testToken',
   createdAt: new Date(),
   updatedAt: new Date(),
};

export const userPresenterMock: UserPresenter = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   telephoneNumber: '123456789',
   billingAccountKey: 'testBilling',
   pushNotificationToken: 'testToken',
   createdAt: new Date(),
   updatedAt: new Date(),
}

export const userWithFile: User = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   telephoneNumber: '123456789',
   billingAccountKey: 'testBilling',
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
   telephoneNumber: '123456789',
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
      telephoneNumber: '123456789',
      billingAccountKey: 'testBilling',
      createdAt: new Date(),
      updatedAt: new Date(),
   },
];

export const createUserDTO: CreateUserDTO = {
   id: '1',
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   telephoneNumber: '123456789',
   billingAccountKey: 'testBilling',
};

export const updateUserDTO: UpdateUserDTO = {
   username: 'John Doe',
   email: 'test@test.com',
   password: 'hashedPassword',
   telephoneNumber: '123456789',
};
