import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class RoleRepo {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findById(id: string) {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }
  async findByIdOrThrow(id: string) {
    return await this.prisma.role.findUniqueOrThrow({
      where: { id },
    });
  }

  async findRoleByNameAndStore(storeId: string, name: string) {
    return await this.prisma.role.findUnique({
      where: { name_storeId: { name, storeId } }, // storeId should be provided
    });
  }

  listByStore(storeId: string) {
    // return [
    //   {
    //     name: 'string',
    //     description: 'string',
    //     storeId,
    //     createdAt: new Date(),
    //   },
    // ];
    return this.prisma.role.findMany({
      where: { storeId },
    });
  }

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return await this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async createOwner(storeId: string) {
    return this.create({
      name: 'owner',
      description: 'Owner of the store',
      storeId,
      RolePermissions: {
        create: {
          permission: {
            connectOrCreate: {
              where: { name: 'all' },
              create: { name: 'all' },
            },
          },
        },
      },
    });
  }

  addPermissionsToRole(roleId: string, permissionIds: string[]) {
    return this.prisma.rolePermissions.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
    });
  }

  removePermissionsFromRole(roleId: string, permissionIds: string[]) {
    return this.prisma.rolePermissions.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });
  }
}
