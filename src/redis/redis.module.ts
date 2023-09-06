import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/common/cache';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: redisStore,
        host: cfg.get<string>('REDIS_HOST'),
        user: cfg.get<string>('REDIS_USER'),
        password: cfg.get<string>('REDIS_PASSWORD'),
        port: cfg.get<number>('REDIS_PORT'),
        ttl: cfg.get('REDIS_TTL'),
      }),
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}
