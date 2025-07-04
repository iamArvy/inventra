import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
