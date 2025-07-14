import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ClientRepo {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.ClientCreateInput) {
    return this.prisma.client.create({ data });
  }

  async list(storeId: string) {
    return this.prisma.client.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        description: true,
        storeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.client.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
      },
    });
  }

  async findByIdOrThrow(id: string) {
    return await this.prisma.client.findUniqueOrThrow({
      where: { id },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
      },
    });
  }

  async findCLientByNameAndStore(storeId: string, name: string) {
    return await this.prisma.client.findUnique({
      where: { name_storeId: { name, storeId } }, // storeId should be provided
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return await this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  attachPermissions(clientId: string, permissionIds: string[]) {
    return this.prisma.clientPermissions.createMany({
      data: permissionIds.map((permissionId) => ({
        clientId,
        permissionId,
      })),
    });
  }

  detachPermissions(clientId: string, permissionIds: string[]) {
    return this.prisma.clientPermissions.deleteMany({
      where: {
        clientId,
        permissionId: { in: permissionIds },
      },
    });
  }
}
