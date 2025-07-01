import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [StoreService],
  exports: [StoreService],
})
export class ServiceModule {}
