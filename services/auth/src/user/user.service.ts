import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserInput,
  UpdateEmailInput,
  UpdatePasswordInput,
} from './dto/user.inputs';
// import { UpdatePasswordInput } from './dto/user.inputs';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  async createUser(data: CreateUserInput) {
    await this.checkIfUserAlreadyExist(data.email);
    const hash = await argon.hash(data.password);
    const user = await this.prisma.user.create({
      data: { email: data.email, password: hash },
      select: { id: true, email: true },
    });

    // Cache User
    // Update User Across Services if needed
    return user;
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    // Cache User
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });
    // if (!user) throw new NotFoundException('User not found');

    // Cache User
    return user;
  }

  async checkIfUserAlreadyExist(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new NotFoundException('User already exists');

    return user;
  }

  async updateUserPassword(id: string, data: UpdatePasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    await this.compareSecrets(user.password, data.oldPassword);
    const hash = await argon.hash(data.newPassword);
    await this.prisma.user.update({
      where: { id },
      data: { password: hash },
    });
  }

  async updatedUserEmail(id: string, data: UpdateEmailInput) {
    await this.prisma.user.update({
      where: { id },
      data: { email: data.email },
    });
  }

  async assignRole(id: string, role_id: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        role: {
          create: {
            role_id,
          },
        },
      },
    });
  }

  async removeRole(id: string, role_id: string) {
    await this.prisma.user.update({
      where: { id },
      data: {
        role: {
          delete: {
            role_id,
          },
        },
      },
    });
  }

  async getUserRoles(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.role || !user.role.role) return null;
    return user.role.role.name;
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
