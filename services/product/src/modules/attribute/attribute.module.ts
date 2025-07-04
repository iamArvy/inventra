import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { DbModule } from 'src/db/db.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [DbModule, CacheModule],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
