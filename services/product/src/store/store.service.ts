import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getUserStore(owner_id: string) {
    // Check Cache First

    const store = await this.prisma.store.findUnique({
      where: { owner_id },
    });

    // Check Source of truth first (Store Service)

    if (!store) throw new NotFoundException('Store Not Found');

    return store;
  }

  getStoreById(id: string) {
    // Check Cache First

    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    // Check Source of truth first (Store Service)

    if (!store) throw new NotFoundException('Store Not Found');

    return store;
  }
}
