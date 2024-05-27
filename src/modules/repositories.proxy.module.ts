import { TypeOrmConfigModule } from '@/services/typeorm/typeorm.module';
import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file/file.repository';
import { UserRepository } from './user/user.repository';

@Module({
   imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, File])],
   providers: [UserRepository, FileRepository],
   exports: [UserRepository, FileRepository],
})
export class RepositoriesModule {}
