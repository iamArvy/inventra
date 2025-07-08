import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { RoleInput } from './role.inputs';
import { BaseService } from 'src/common/services/base/base.service';
import { CacheKeys } from 'src/cache/cache-keys';
import { CacheService } from 'src/cache/cache.service';
import { RoleDto, RoleList } from './role.dto';
import { Status } from 'src/common/dto/app.response';
@Injectable()
export class RoleService extends BaseService {
  constructor(
    private repo: RoleRepo,
    private cache: CacheService,
  ) {
    super();
  }

  async create(
    storeId: string,
    data: RoleInput,
    permissions: string[],
  ): Promise<RoleDto> {
    try {
      const exist = await this.repo.findRoleByNameAndStore(storeId, data.name);
      if (exist) throw new BadRequestException('Role already exists in store');
      const role = await this.repo.create({ ...data, storeId, permissions });
      if (!role) {
        throw new BadRequestException('Failed to create role');
      }
      if (permissions && permissions.length > 0) {
        const updatedRole = await this.repo.addPermissionsToRole(
          role.id,
          permissions,
        );
        if (!updatedRole) {
          throw new BadRequestException('Failed to add permissions to role');
        }
      }
      await this.cache.delete(CacheKeys.storeRoles(storeId));
      this.logger.log(`Role created: ${role.id} in store: ${storeId}`);
      return role;
    } catch (error) {
      this.handleError(error, 'RoleService.createRole');
    }
  }

  async listByStore(storeId: string): Promise<RoleList> {
    try {
      const cachedRoles = await this.cache.get<RoleDto[]>(
        CacheKeys.storeRoles(storeId),
      );
      if (cachedRoles) {
        return { roles: cachedRoles };
      }
      const roles = await this.repo.listByStore(storeId);
      await this.cache.set(CacheKeys.storeRoles(storeId), roles, '4h');
      return { roles };
    } catch (error) {
      this.handleError(error, 'RoleService.findAllRoles');
    }
  }

  async get(id: string): Promise<RoleDto> {
    try {
      const cachedRole = await this.cache.get<RoleDto>(CacheKeys.role(id));
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

  async update(
    id: string,
    storeId: string,
    data: Partial<RoleInput>,
  ): Promise<Status> {
    try {
      const role = await this.repo.findByIdOrThrow(id);
      if (role.storeId !== storeId)
        throw new NotFoundException('Role not found in this store');

      if (data.name) {
        const exist = await this.repo.findRoleByNameAndStore(
          storeId,
          data.name,
        );
        if (exist)
          throw new BadRequestException(
            'Role with name already exists in store',
          );
      }

      await this.repo.update(id, { name: data.name });
      await this.cache.delete(CacheKeys.storeRoles(storeId));
      await this.cache.delete(CacheKeys.role(id));
      this.logger.log(`Role updated: ${id} in store: ${storeId}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.updateRole');
    }
  }

  async delete(id: string): Promise<Status> {
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

  async attachPermissions(
    id: string,
    permissions: string[],
    storeId: string,
  ): Promise<Status> {
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

  async detachPermissions(
    id: string,
    permissions: string[],
    storeId: string,
  ): Promise<Status> {
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
