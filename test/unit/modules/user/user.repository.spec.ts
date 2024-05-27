import { IUserRepository } from '@/common/interfaces/repositories/user.repository';
import { User } from '@/entities/user.entity';
import { UserRepository } from '@/modules/user/user.repository';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDTO, user, users } from '../../mocks/user.mock';

describe('UserRepository', () => {
   let userRepository: IUserRepository;
   let repository: Repository<User>;

   beforeEach(async () => {
      repository = createMock<Repository<User>>({
         findOne: jest.fn(),
         find: jest.fn(),
         save: jest.fn(),
         delete: jest.fn(),
         create: jest.fn(),
      });

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            UserRepository,
            {
               provide: getRepositoryToken(User),
               useValue: repository,
            },
         ],
      })
         .useMocker(() => createMock())
         .compile();

      userRepository = module.get<IUserRepository>(UserRepository);
   });

   describe('findByKey', () => {
      it('should return a user when called with valid key and value', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(user);

         const result = await userRepository.findByKey('username', 'John Doe');

         expect(result).toEqual(user);

         expect(repository.findOne).toHaveBeenCalledWith({
            where: { ['username']: 'John Doe' },
            relations: ['file'],
         });
      });

      it('should return null when user is not found', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(null);

         const result = await userRepository.findByKey('username', 'John Doe');

         expect(result).toBeNull();
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { ['username']: 'John Doe' },
            relations: ['file'],
         });
      });
   });

   describe('findAll', () => {
      it('should return all users', async () => {
         jest.spyOn(repository, 'find').mockResolvedValue(users);

         const result = await userRepository.findAll();

         expect(result).toEqual(users);
         expect(repository.find).toHaveBeenCalledWith({
            relations: ['file'],
         });
      });

      it('should return an empty array if no users are found', async () => {
         jest.spyOn(repository, 'find').mockResolvedValue([]);

         const result = await userRepository.findAll();

         expect(result).toEqual([]);
         expect(repository.find).toHaveBeenCalledWith({
            relations: ['file'],
         });
      });
   });

   describe('findOne', () => {
      it('should return a user when called with a valid id', async () => {
         const id = '1';
         jest.spyOn(repository, 'findOne').mockResolvedValue(user);

         const result = await userRepository.findOne(id);

         expect(result).toEqual(user);
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['file'],
         });
      });

      it('should return null when called with an id that does not exist', async () => {
         const id = '2';
         jest.spyOn(repository, 'findOne').mockResolvedValue(null);

         const result = await userRepository.findOne(id);

         expect(result).toBeNull();
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id },
            relations: ['file'],
         });
      });
   });

   describe('create', () => {
      it('should create a new user', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(user);
         jest.spyOn(repository, 'save').mockResolvedValue(user);

         const result = await userRepository.create(createUserDTO);

         expect(result).toEqual(user);
         expect(repository.create).toHaveBeenCalledWith(createUserDTO);
         expect(repository.save).toHaveBeenCalledWith(user);
      });

      it('should throw an error if repository.create throws an error', async () => {
         jest.spyOn(repository, 'create').mockImplementation(() => {
            throw new Error();
         });

         await expect(userRepository.create(createUserDTO)).rejects.toThrow();
         expect(repository.create).toHaveBeenCalledWith(createUserDTO);
      });

      it('should throw an error if repository.save throws an error', async () => {
         jest.spyOn(repository, 'create').mockReturnValue(user);
         jest.spyOn(repository, 'save').mockImplementation(() => {
            throw new Error();
         });

         await expect(userRepository.create(createUserDTO)).rejects.toThrow();
         expect(repository.create).toHaveBeenCalledWith(createUserDTO);
         expect(repository.save).toHaveBeenCalledWith(user);
      });
   });

   describe('update', () => {
      it('should update a user and return the updated user when called with a valid id and user object', async () => {
         const id = '1';
         const updatedUser = { ...user, username: 'updated' };
         jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

         const result = await userRepository.update(id, updatedUser);

         expect(result).toEqual(updatedUser);
         expect(repository.save).toHaveBeenCalledWith({ ...updatedUser, id });
      });

      it('should throw an error if repository.save throws an error', async () => {
         const id = '1';
         const updatedUser = { ...user, username: 'updated' };

         jest.spyOn(repository, 'save').mockImplementation(() => {
            throw new Error();
         });

         await expect(userRepository.update(id, updatedUser)).rejects.toThrow();
         expect(repository.save).toHaveBeenCalledWith({ ...updatedUser, id });
      });
   });

   describe('delete', () => {
      it('should delete a user when called with a valid id', async () => {
         const id = '1';
         jest.spyOn(repository, 'findOne').mockResolvedValue(user);
         jest
            .spyOn(repository, 'delete')
            .mockResolvedValue({ affected: 1, raw: user });

         const result = await userRepository.delete(id);

         expect(result).toEqual(user);
         expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
         expect(repository.delete).toHaveBeenCalledWith(id);
      });

      it('should return undefined when called with an id that does not exist', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(null);

         const result = await userRepository.delete('2');

         expect(result).toEqual(undefined);

         expect(repository.findOne).toHaveBeenCalledWith({
            where: { id: '2' },
         });

         expect(repository.delete).not.toHaveBeenCalled();
      });
   });

   describe('alreadyExists', () => {
      it('should return true if user already exists', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(user);

         const result = await userRepository.alreadyExists(
            'username',
            'John Doe',
         );

         expect(result).toEqual(true);
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { username: 'John Doe' },
         });
      });

      it('should return false if user does not exist', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(null);

         const result = await userRepository.alreadyExists(
            'username',
            'John Doe',
         );

         expect(result).toEqual(false);
         expect(repository.findOne).toHaveBeenCalledWith({
            where: { username: 'John Doe' },
         });
      });

      it('should return true if user exists but id does not match', async () => {
         jest.spyOn(repository, 'findOne').mockResolvedValue(user);

         const result = await userRepository.alreadyExists(
            'username',
            'John Doe',
            '2',
         );

         expect(result).toEqual(true);

         expect(repository.findOne).toHaveBeenCalledWith({
            where: { username: 'John Doe' },
         });
      });

      it('should return false if value is not provided', async () => {
         const spy = jest.spyOn(repository, 'findOne');

         const result = await userRepository.alreadyExists('username', '');

         expect(result).toEqual(false);
         expect(spy).not.toHaveBeenCalled();
      });
   });
});
