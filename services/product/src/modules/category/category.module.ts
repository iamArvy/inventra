import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
