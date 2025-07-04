import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  providers: [VariantService],
  controllers: [VariantController],
})
export class VariantModule {}
