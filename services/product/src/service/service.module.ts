import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AttributeService } from './attribute/attribute.service';
import { CacheService } from './cache/cache.service';
import { CategoryService } from './category/category.service';
import { ProductService } from './product/product.service';
import { VariantService } from './variant/variant.service';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://localhost:6379');
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    AttributeService,
    CacheService,
    CategoryService,
    ProductService,
    VariantService,
  ],
  exports: [AttributeService, CategoryService, ProductService, VariantService],
})
export class ServiceModule {}
