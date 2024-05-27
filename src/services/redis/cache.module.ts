import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { CacheService } from './cache.service';

@Module({
   imports: [
      ConfigModule.forRoot(),
      CacheModule.register<RedisClientOptions>({
         url: process.env.REDIS_URL,
      }),
   ],
   providers: [CacheService],
   exports: [CacheService],
})
export class CacheConfigModule {}
