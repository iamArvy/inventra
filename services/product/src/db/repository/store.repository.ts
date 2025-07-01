import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    // Check Cache First

    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    // Check Source of truth first (Store Service)

    if (!store) throw new NotFoundException('Store Not Found');

    return store;
  }
}
