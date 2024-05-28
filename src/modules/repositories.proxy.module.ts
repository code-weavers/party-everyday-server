import { Address } from '@/entities/address.entity';
import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import { TypeOrmConfigModule } from '@/services/typeorm/typeorm.module';
import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './address/address.repository';
import { FileRepository } from './file/file.repository';
import { PartyRepository } from './party/party.repository';
import { UserRepository } from './user/user.repository';

@Module({
   imports: [
      TypeOrmConfigModule,
      TypeOrmModule.forFeature([User, File, Address, Guest, Party]),
   ],
   providers: [
      UserRepository,
      FileRepository,
      AddressRepository,
      PartyRepository,
   ],
   exports: [
      UserRepository,
      FileRepository,
      AddressRepository,
      PartyRepository,
   ],
})
export class RepositoriesModule {}
