import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { RoleData } from './dto/role.inputs';
import { BaseService } from 'src/common/base/base.service';
import { Role } from 'generated/prisma';
import { CacheKeys } from 'src/common/cache/cache-keys';
@Injectable()
export class RoleService extends BaseService {
  constructor(private repo: RoleRepo) {
    super();
  }

  async create(storeId: string, data: RoleData) {
    try {
      const exist = await this.repo.findRoleByNameAndStore(storeId, data.name);
      if (exist) throw new BadRequestException('Role already exists in store');
      const role = await this.repo.create({ ...data, storeId });
      if (!role) {
        throw new BadRequestException('Failed to create role');
      }
      await this.cache.delete(CacheKeys.storeRoles(storeId));
      this.logger.log(`Role created: ${role.id} in store: ${storeId}`);
    } catch (error) {
      this.handleError(error, 'RoleService.createRole');
    }
  }

  async listByStore(storeId: string) {
    try {
      const cachedRoles = await this.cache.get<Role[]>(
        CacheKeys.storeRoles(storeId),
      );
      if (cachedRoles) {
        return cachedRoles;
      }
      const roles = await this.repo.listByStore(storeId);
      await this.cache.set(CacheKeys.storeRoles(storeId), roles, '4h');
      return roles;
    } catch (error) {
      this.handleError(error, 'RoleService.findAllRoles');
    }
  }

  async find(id: string) {
    try {
      const cachedRole = await this.cache.get<Role[]>(CacheKeys.role(id));
      if (cachedRole) {
        return cachedRole;
      }
      const role = await this.repo.findById(id);
      if (!role) throw new NotFoundException('Role not found');
      await this.cache.set(CacheKeys.role(id), role, '4h');
      return role;
    } catch (error) {
      this.handleError(error, 'RoleService.findRole');
    }
  }

  async update(id: string, storeId: string, data: RoleData) {
    try {
      const role = await this.repo.findByIdOrThrow(id);
      if (role.storeId !== storeId)
        throw new NotFoundException('Role not found in this store');
      const exist = await this.repo.findRoleByNameAndStore(storeId, data.name);
      if (exist)
        throw new BadRequestException('Role with name already exists in store');
      await this.repo.update(id, { name: data.name });
      await this.cache.delete(CacheKeys.storeRoles(storeId));
      await this.cache.delete(CacheKeys.role(id));
      this.logger.log(`Role updated: ${id} in store: ${storeId}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.updateRole');
    }
  }

  async delete(id: string) {
    try {
      const role = await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      await this.cache.delete(CacheKeys.storeRoles(role.storeId));
      await this.cache.delete(CacheKeys.role(id));
      this.logger.log(`Role deleted: ${id} in store: ${role.storeId}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.deleteRole');
    }
  }

  async addPermissions(id: string, permissions: string[], storeId: string) {
    try {
      const role = await this.repo.findByIdOrThrow(id);
      if (role.storeId !== storeId)
        throw new NotFoundException('Role not found in this store');
      const updatedRole = await this.repo.addPermissionsToRole(id, permissions);
      if (!updatedRole) {
        throw new BadRequestException('Failed to add permissions to role');
      }
      await this.cache.delete(CacheKeys.rolePermissions(id));
      this.logger.log(`Permissions added to role: ${id} in store: ${storeId}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.addPermissions');
    }
  }

  async removePermissions(id: string, permissions: string[], storeId: string) {
    try {
      const role = await this.repo.findByIdOrThrow(id);
      if (role.storeId !== storeId)
        throw new NotFoundException('Role not found in this store');
      const updatedRole = await this.repo.removePermissionsFromRole(
        id,
        permissions,
      );
      if (!updatedRole) {
        throw new BadRequestException('Failed to remove permissions from role');
      }
      await this.cache.delete(CacheKeys.rolePermissions(id));
      this.logger.log(
        `Permissions removed from role: ${id} in store: ${storeId}`,
      );
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.removePermissions');
    }
  }
}
