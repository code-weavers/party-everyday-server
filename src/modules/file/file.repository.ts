import { IFileRepository } from '@/common/interfaces/repositories/file.repository';
import { File } from '@entities/file.entity';
import { OwnerType } from '@enums/ownerType.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDTO } from './presenters/file.dto';

@Injectable()
export class FileRepository implements IFileRepository {
   constructor(
      @InjectRepository(File)
      private repository: Repository<File>,
   ) {}

   public async findOne(ownerId: string, ownerType: OwnerType): Promise<File> {
      return await this.repository.findOne({ where: { ownerId, ownerType } });
   }

   public async findAll(
      ownerId: string,
      ownerType: OwnerType,
   ): Promise<File[]> {
      return await this.repository.find({ where: { ownerId, ownerType } });
   }

   public async findByKey(key: string, value: string): Promise<File> {
      return await this.repository.findOne({ where: { [key]: value } });
   }

   public async create(
      files: CreateFileDTO,
      ownerId: string,
      ownerType: OwnerType,
   ): Promise<File> {
      files.ownerId = ownerId;
      files.ownerType = ownerType;

      return await this.repository.save(files);
   }

   public async update(
      file: CreateFileDTO,
      ownerId: string,
      ownerType: OwnerType,
   ): Promise<File> {
      const findedFile: File = await this.findByKey('ownerId', ownerId);

      if (findedFile) await this.delete(ownerId, ownerType);

      return await this.create(file, ownerId, ownerType);
   }

   public async updateMany(
      files: CreateFileDTO[],
      ownerId: string,
      ownerType: OwnerType,
   ): Promise<File[]> {
      const updatedFiles: File[] = [];

      const findedFiles: File[] = await this.findAll(ownerId, ownerType);

      if (findedFiles) {
         for (const file of findedFiles) {
            await this.delete(file.ownerId, file.ownerType);
         }
      }

      for (const file of files) {
         updatedFiles.push(await this.create(file, ownerId, ownerType));
      }

      return updatedFiles;
   }

   public async delete(ownerId: string, ownerType: OwnerType): Promise<File> {
      const file = await this.findOne(ownerId, ownerType);

      this.repository.delete({ ownerId });

      return file;
   }
}
