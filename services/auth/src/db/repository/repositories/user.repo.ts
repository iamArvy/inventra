import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma, User } from 'generated/prisma';

@Injectable()
export class UserRepo {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  createMany(data: Prisma.UserCreateManyInput[]) {
    return this.prisma.user.createMany({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  updateEmailVerified(id: string, status: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: status },
    });
  }

  updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  updateEmail(id: string, email: string) {
    return this.prisma.user.update({
      where: { id },
      data: { email },
    });
  }

  listByStore(storeId: string) {
    return this.prisma.user.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        email: true,
        storeId: true,
        roleId: true,
        createdAt: true,
        emailVerified: true,
      },
    });
  }

  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
