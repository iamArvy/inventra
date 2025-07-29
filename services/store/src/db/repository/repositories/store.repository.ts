import { Injectable } from '@nestjs/common';
import { PrismaService } from 'db/prisma.service';
import { Prisma, Store } from 'generated/prisma';

type StoreStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';
@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.StoreCreateInput) {
    return this.prisma.store.create({
      data,
    });
  }

  update(id: string, data: Prisma.StoreUpdateInput) {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  findById(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.store.findMany();
  }

  async findByStatus(status: StoreStatus): Promise<Store[]> {
    return await this.prisma.store.findMany({
      where: {
        status,
      },
    });
  }

  async setStatus(id: string, status: StoreStatus) {
    return this.update(id, { status });
  }

  async delete(id: string) {
    return this.prisma.store.delete({
      where: { id },
    });
  }
}
