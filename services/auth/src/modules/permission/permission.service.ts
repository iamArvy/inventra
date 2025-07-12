import { Injectable, Logger } from '@nestjs/common';
import { PermissionRepo } from 'src/db/repositories/permission.repo';
import { CacheKeys } from 'src/cache/cache-keys';
import { CacheService } from 'src/cache/cache.service';
import { PermissionDto, PermissionList } from './permission.dto';
import { PermissionInput } from './permission.inputs';
import { Status } from 'src/common/dto/app.response';
import { Cached } from 'src/common/decorators/cache.decorator';

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepo,
    private readonly cache: CacheService,
  ) {}

  protected readonly logger = new Logger(this.constructor.name);

  // create
  async create(data: { name: string; description?: string }) {
    const permission = await this.repo.create(data);
    if (!permission) {
      throw new Error('Failed to create permission');
    }
    this.logger.log(`Permission created: ${permission.id}`);
    await this.cache.delete(CacheKeys.permissions); // Clear cache if needed
    await this.cache.set(CacheKeys.permission(permission.id), permission, '1y'); // Cache the created permission
    return permission;
  }

  // findAll
  @Cached<PermissionList>('4h', () => CacheKeys.permissions)
  async list(): Promise<PermissionList> {
    const permissions = await this.repo.list();
    await this.cache.set(CacheKeys.permissions, permissions, '4h');
    return { permissions };
  }

  // findById
  @Cached<PermissionDto>('4h', (id: string) => CacheKeys.permission(id))
  async findById(id: string): Promise<PermissionDto> {
    const permission = await this.repo.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
  }
  // listRolePermissions
  @Cached<PermissionList>('4h', (roleId: string) =>
    CacheKeys.rolePermissions(roleId),
  )
  async listRolePermissions(roleId: string): Promise<PermissionList> {
    const permissions = await this.repo.listByRole(roleId);
    if (!permissions || permissions.length === 0) {
      throw new Error('No permissions found for this role');
    }
    return { permissions };
  }

  // update
  async update(id: string, data: Partial<PermissionInput>): Promise<Status> {
    await this.repo.findByIdOrThrow(id);
    const updatedPermission = await this.repo.update(id, data);
    if (!updatedPermission) {
      throw new Error('Failed to update permission');
    }
    await this.cache.delete(CacheKeys.permission(id));
    await this.cache.set(CacheKeys.permission(id), updatedPermission, '4h');
    return { success: true };
  }

  // delete
  async delete(id: string): Promise<Status> {
    const permission = await this.repo.findByIdOrThrow(id);
    await this.repo.delete(id);
    await this.cache.delete(CacheKeys.permission(id));
    await this.cache.delete(CacheKeys.permissions);
    this.logger.log(`Permission deleted: ${permission.id}`);
    return { success: true };
  }
}
