import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base/base.service';
import { PermissionRepo } from 'src/db/repositories/permission.repo';
import { CacheKeys } from 'src/cache/cache-keys';
import { Permission } from 'generated/prisma';
import { CacheService } from 'src/cache/cache.service';
import { PermissionDto, PermissionList } from './permission.dto';
import { PermissionInput } from './permission.inputs';
import { Status } from 'src/common/dto/app.response';

@Injectable()
export class PermissionService extends BaseService {
  constructor(
    private readonly repo: PermissionRepo,
    private readonly cache: CacheService,
  ) {
    super();
  }

  // create
  async create(data: { name: string; description?: string }) {
    try {
      const permission = await this.repo.create(data);
      if (!permission) {
        throw new Error('Failed to create permission');
      }
      this.logger.log(`Permission created: ${permission.id}`);
      await this.cache.delete(CacheKeys.permissions); // Clear cache if needed
      await this.cache.set(
        CacheKeys.permission(permission.id),
        permission,
        '1y',
      ); // Cache the created permission
      return permission;
    } catch (error) {
      this.handleError(error, 'PermissionService.create');
    }
  }

  // findAll
  async list(): Promise<PermissionList> {
    try {
      const cachedPermissions = await this.cache.get<Permission[]>(
        CacheKeys.permissions,
      );
      if (cachedPermissions) {
        return { permissions: cachedPermissions };
      }
      const permissions = await this.repo.list();
      await this.cache.set(CacheKeys.permissions, permissions, '4h');
      return { permissions };
    } catch (error) {
      this.handleError(error, 'PermissionService.findAll');
    }
  }

  // findById
  async findById(id: string): Promise<PermissionDto> {
    try {
      const cachedPermission = await this.cache.get<Permission>(
        CacheKeys.permission(id),
      );
      if (cachedPermission) {
        return cachedPermission;
      }
      const permission = await this.repo.findById(id);
      if (!permission) {
        throw new Error('Permission not found');
      }
      await this.cache.set(CacheKeys.permission(id), permission, '4h');
      return permission;
    } catch (error) {
      this.handleError(error, 'PermissionService.findById');
    }
  }
  // listRolePermissions
  async listRolePermissions(roleId: string): Promise<PermissionList> {
    try {
      const cachedPermissions = await this.cache.get<Permission[]>(
        CacheKeys.rolePermissions(roleId),
      );
      if (cachedPermissions) {
        return { permissions: cachedPermissions };
      }
      const permissions = await this.repo.listByRole(roleId);
      if (!permissions || permissions.length === 0) {
        throw new Error('No permissions found for this role');
      }
      await this.cache.set(
        CacheKeys.rolePermissions(roleId),
        permissions,
        '4h',
      );
      return { permissions };
    } catch (error) {
      this.handleError(error, 'PermissionService.listRolePermissions');
    }
  }

  // update
  async update(id: string, data: Partial<PermissionInput>): Promise<Status> {
    try {
      await this.repo.findByIdOrThrow(id);
      const updatedPermission = await this.repo.update(id, data);
      if (!updatedPermission) {
        throw new Error('Failed to update permission');
      }
      await this.cache.delete(CacheKeys.permission(id));
      await this.cache.set(CacheKeys.permission(id), updatedPermission, '4h');
      return { success: true };
    } catch (error) {
      this.handleError(error, 'PermissionService.update');
    }
  }

  // delete
  async delete(id: string): Promise<Status> {
    try {
      const permission = await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      await this.cache.delete(CacheKeys.permission(id));
      await this.cache.delete(CacheKeys.permissions);
      this.logger.log(`Permission deleted: ${permission.id}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'PermissionService.deletePermission');
    }
  }
}
