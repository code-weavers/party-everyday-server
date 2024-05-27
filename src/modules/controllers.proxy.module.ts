import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
   imports: [UserModule.register(), AuthModule.register()],
   controllers: [UserController, AuthController],
   exports: [UserModule.register(), AuthModule.register()],
})
export class ControllersModule {}
