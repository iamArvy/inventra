import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';

@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://localhost:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
