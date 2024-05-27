import { Address } from '@/entities/address.entity';
import { TypeOrmConfigModule } from '@/services/typeorm/typeorm.module';
import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './address/address.repository';
import { FileRepository } from './file/file.repository';
import { UserRepository } from './user/user.repository';

@Module({
   imports: [
      TypeOrmConfigModule,
      TypeOrmModule.forFeature([User, File, Address]),
   ],
   providers: [UserRepository, FileRepository, AddressRepository],
   exports: [UserRepository, FileRepository, AddressRepository],
})
export class RepositoriesModule {}
