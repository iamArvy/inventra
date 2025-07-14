import { Injectable, Logger } from '@nestjs/common';
import { PermissionRepo } from 'src/db/repository/repositories/permission.repo';

const permissions = [{ name: 'all', description: 'All permissions' }];

@Injectable()
export class PermissionSeeder {
  private readonly logger = new Logger(PermissionSeeder.name);
  constructor(private readonly permission: PermissionRepo) {}

  async seed() {
    await this.permission.createMany(permissions);
    return this.logger.log('Permissions created successfully');
  }
}
