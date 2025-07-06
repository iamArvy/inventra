import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PermissionRepo {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.PermissionCreateInput) {
    return this.prisma.permission.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findById(id: string) {
    return await this.prisma.permission.findUnique({
      where: { id },
    });
  }
  async findByIdOrThrow(id: string) {
    return await this.prisma.permission.findUniqueOrThrow({
      where: { id },
    });
  }

  async findRoleByNameAndStore(storeId: string, name: string) {
    return await this.prisma.role.findUnique({
      where: { name_storeId: { name, storeId } }, // storeId should be provided
    });
  }

  listByRole(roleId: string) {
    return this.prisma.permission.findMany({
      where: { RolePermissions: { some: { roleId } } },
    });
  }

  async update(id: string, data: Prisma.PermissionUpdateInput) {
    return await this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
