import { AdditionalPartyInfo } from '@/entities/additionalPartyInfo.entity';
import { Address } from '@/entities/address.entity';
import { Checkout } from '@/entities/checkout.entity';
import { Guest } from '@/entities/guest.entity';
import { Party } from '@/entities/party.entity';
import { TypeOrmConfigModule } from '@/services/typeorm/typeorm.module';
import { File } from '@entities/file.entity';
import { User } from '@entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressRepository } from './address/address.repository';
import { CheckoutRepository } from './checkout/checkout.repository';
import { FileRepository } from './file/file.repository';
import { PartyRepository } from './party/party.repository';
import { UserRepository } from './user/user.repository';

@Module({
   imports: [
      TypeOrmConfigModule,
      TypeOrmModule.forFeature([User, File, Address, Guest, Party, AdditionalPartyInfo, Checkout]),
   ],
   providers: [
      UserRepository,
      FileRepository,
      AddressRepository,
      PartyRepository,
      CheckoutRepository,
   ],
   exports: [
      UserRepository,
      FileRepository,
      AddressRepository,
      PartyRepository,
      CheckoutRepository,
   ],
})
export class RepositoriesModule { }
