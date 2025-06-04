import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuperuserSeeder {
  private readonly logger = new Logger(SuperuserSeeder.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly prisma: PrismaService,
  ) {}
  async seedSuperuser() {
    const email = this.configService.get<string>('SUPERUSER_EMAIL');
    if (!email) {
      this.logger.log('Superuser email not set');
      return;
    }
    const password = this.configService.get<string>('SUPERUSER_PASSWORD');
    if (!password) {
      this.logger.log('Superuser Password not set');
      return;
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            role: true,
          },
        },
      },
    });

    if (existingUser) {
      this.logger.log('Superuser already exists');
      return;
    }

    let superuserRole = await this.prisma.role.findUnique({
      where: { name: 'superuser' },
    });

    if (!superuserRole) {
      this.logger.log('Creating superuser role...');
      superuserRole = await this.prisma.role.create({
        data: {
          name: 'superuser',
        },
      });
      this.logger.log('Superuser role created successfully');
    }

    this.logger.log('Creating superuser account...');
    const user = await this.userService.createUser({
      email,
      password,
    });

    await this.userService.assignRole(user.id, superuserRole.id);
    this.logger.log('Superuser created successfully');
  }
}
