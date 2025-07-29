import { Module } from '@nestjs/common';
import { StoreModule } from './modules/store/store.module';
import { RepositoryModule } from 'db/repository/repository.module';

@Module({
  imports: [StoreModule, RepositoryModule],
})
export class AppModule {}
