import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateStoreInput, UpdateStoreInput } from './dto';
import { Store } from 'generated/prisma';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  createStore(uid: string, data: CreateStoreInput) {
    const store = this.prisma.store.create({
      data: {
        ...data,
        owner_id: uid,
      },
    });

    return store;
    // emit the store creation so admin can activate
  }

  updateStore(id: string, data: UpdateStoreInput) {
    const store = this.prisma.store.update({
      where: { id },
      data,
    });

    return store;
  }

  async activateStore(id: string) {
    const store = await this.getStoreById(id);

    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'ACTIVE')
      throw new BadRequestException('Store already active');

    await this.prisma.store.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
    return true;
  }

  async deactivateStore(id: string) {
    const store = await this.getStoreById(id);

    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'INACTIVE')
      throw new BadRequestException('Store already deactivated');

    await this.prisma.store.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
    return true;
  }

  getStoreById(id: string) {
    const store = this.prisma.store.findUnique({
      where: { id },
    });

    return store;
  }

  getStoreByOwnerId(owner_id: string) {
    const store = this.prisma.store.findUnique({
      where: {
        owner_id,
      },
    });

    return store;
  }

  getAllStores() {
    const stores = this.prisma.store.findMany();
    return stores;
  }

  async getStoresByStatus(
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE',
  ): Promise<Store[]> {
    const stores = await this.prisma.store.findMany({
      where: {
        status,
      },
    });
    return stores;
  }

  async getPendingStores() {
    return await this.getStoresByStatus('PENDING');
  }

  async getActiveStores() {
    return await this.getStoresByStatus('ACTIVE');
  }

  async getInactiveStores() {
    return await this.getStoresByStatus('INACTIVE');
  }

  async getStoresByCategory(category_id: string) {
    return await this.prisma.store.findMany({
      where: {
        category_id,
      },
    });
  }
}
