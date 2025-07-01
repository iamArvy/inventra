import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { StoreRepository } from './repository/store.repository';

@Module({
  providers: [PrismaService, StoreRepository],
  exports: [StoreRepository],
})
export class DbModule {}
