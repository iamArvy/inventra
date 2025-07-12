import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { PermissionRepo } from '../repositories/permission.repo';

const permissions = [{ name: 'all', description: 'All permissions' }];

@Injectable()
export class PermissionSeeder {
  private readonly logger = new Logger(PermissionSeeder.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly permission: PermissionRepo,
  ) {}

  async seedPermissions() {
    await this.permission.createMany(permissions);
    return this.logger.log('Permissions created successfully');
  }
}
