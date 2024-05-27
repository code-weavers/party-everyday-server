import { FileRepository } from '@/modules/file/file.repository';
import { CreateFileDTO } from '@/modules/file/presenters/file.dto';
import { File } from '@entities/file.entity';
import { OwnerType } from '@enums/ownerType.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('FileRepository', () => {
   let fileRepository: FileRepository;
   let mockRepository: Partial<Repository<File>>;

   beforeEach(async () => {
      mockRepository = {
         findOne: jest.fn(),
         find: jest.fn(),
         save: jest.fn(),
         delete: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            FileRepository,
            { provide: getRepositoryToken(File), useValue: mockRepository },
         ],
      }).compile();

      fileRepository = module.get<FileRepository>(FileRepository);
   });

   it('should find one file', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const file = new File();

      (mockRepository.findOne as jest.Mock).mockResolvedValue(file);

      const result = await fileRepository.findOne(ownerId, ownerType);

      expect(result).toEqual(file);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
         where: { ownerId, ownerType },
      });
   });

   it('should find all files', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const files = [new File(), new File()];

      (mockRepository.find as jest.Mock).mockResolvedValue(files);

      const result = await fileRepository.findAll(ownerId, ownerType);

      expect(result).toEqual(files);
      expect(mockRepository.find).toHaveBeenCalledWith({
         where: { ownerId, ownerType },
      });
   });

   it('should find file by key', async () => {
      const key = 'ownerId';
      const value = '1';
      const file = new File();

      (mockRepository.findOne as jest.Mock).mockResolvedValue(file);

      const result = await fileRepository.findByKey(key, value);

      expect(result).toEqual(file);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
         where: { [key]: value },
      });
   });

   it('should create a file', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const fileDTO = new CreateFileDTO({
         key: 'key',
         url: 'url',
         mimetype: 'mimetype',
      });
      const file = new File();

      (mockRepository.save as jest.Mock).mockResolvedValue(file);

      const result = await fileRepository.create(fileDTO, ownerId, ownerType);

      expect(result).toEqual(file);
      expect(mockRepository.save).toHaveBeenCalledWith(fileDTO);
   });

   it('should update a file', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const fileDTO = new CreateFileDTO({
         key: 'key',
         url: 'url',
         mimetype: 'mimetype',
      });
      const file = new File();

      (mockRepository.findOne as jest.Mock).mockResolvedValue(file);
      (mockRepository.save as jest.Mock).mockResolvedValue(file);

      const result = await fileRepository.update(fileDTO, ownerId, ownerType);

      expect(result).toEqual(file);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
         where: { ownerId: ownerId },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({ ownerId });
      expect(mockRepository.save).toHaveBeenCalledWith(fileDTO);
   });

   it('should update many files', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const files = [
         new CreateFileDTO({
            key: 'key1',
            url: 'url1',
            mimetype: 'mimetype1',
         }),
         new CreateFileDTO({
            key: 'key2',
            url: 'url2',
            mimetype: 'mimetype2',
         }),
      ];
      const existingFiles = [new File(), new File()];

      (mockRepository.find as jest.Mock).mockResolvedValue(existingFiles);
      (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);
      (mockRepository.save as jest.Mock).mockImplementation((file) =>
         Promise.resolve(file),
      );

      const result = await fileRepository.updateMany(files, ownerId, ownerType);

      expect(result).toEqual(files);
      expect(mockRepository.find).toHaveBeenCalledWith({
         where: { ownerId, ownerType },
      });
      for (const file of existingFiles) {
         expect(mockRepository.delete).toHaveBeenCalledWith({
            ownerId: file.ownerId,
         });
      }
      for (const file of files) {
         expect(mockRepository.save).toHaveBeenCalledWith(file);
      }
   });

   it('should delete a file', async () => {
      const ownerId = '1';
      const ownerType = OwnerType.USER;
      const file = new File();

      (mockRepository.findOne as jest.Mock).mockResolvedValue(file);

      const result = await fileRepository.delete(ownerId, ownerType);

      expect(result).toEqual(file);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
         where: { ownerId, ownerType },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({ ownerId });
   });
});
