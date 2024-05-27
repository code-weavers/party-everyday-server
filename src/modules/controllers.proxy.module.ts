import { Module } from '@nestjs/common';
import { AddressController } from './address/address.controller';
import { AddressModule } from './address/address.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
   imports: [
      UserModule.register(),
      AuthModule.register(),
      AddressModule.register(),
   ],
   controllers: [UserController, AuthController, AddressController],
   exports: [
      UserModule.register(),
      AuthModule.register(),
      AddressModule.register(),
   ],
})
export class ControllersModule {}
