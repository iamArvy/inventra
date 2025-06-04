import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async createRole(data: Prisma.RoleCreateInput) {
    const role = await this.prisma.role.findUnique({
      where: { name: data.name },
    });
    if (role) throw new BadRequestException('Role already exists');
    return this.prisma.role.create({ data });
  }

  async findAllRoles() {
    return this.prisma.role.findMany();
  }

  async findRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async findRoleByName(name: string) {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, data: Prisma.RoleUpdateInput) {
    return await this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: string) {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
