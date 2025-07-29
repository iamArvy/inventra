import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StoreRepository } from '.';

@Module({
  providers: [PrismaService, StoreRepository],
  exports: [StoreRepository],
})
@Global()
export class RepositoryModule {}
