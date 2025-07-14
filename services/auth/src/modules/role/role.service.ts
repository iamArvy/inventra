import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepo } from 'src/db/repository';
import { RoleInput } from './role.inputs';
import { RoleDto, RoleList } from './role.dto';
import { Status } from 'src/common/dto/app.response';
@Injectable()
export class RoleService {
  constructor(private repo: RoleRepo) {}

  protected readonly logger = new Logger(this.constructor.name);

  async create(
    storeId: string,
    data: RoleInput,
    permissions: string[],
  ): Promise<RoleDto> {
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
    this.logger.log(`Role created: ${role.id} in store: ${storeId}`);
    return role;
  }

  async listByStore(storeId: string): Promise<RoleList> {
    return { roles: await this.repo.listByStore(storeId) };
  }

  async get(id: string): Promise<RoleDto> {
    const role = await this.repo.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(
    id: string,
    storeId: string,
    data: Partial<RoleInput>,
  ): Promise<Status> {
    const role = await this.repo.findByIdOrThrow(id);
    if (role.storeId !== storeId)
      throw new NotFoundException('Role not found in this store');

    if (data.name) {
      const exist = await this.repo.findRoleByNameAndStore(storeId, data.name);
      if (exist)
        throw new BadRequestException('Role with name already exists in store');
    }

    await this.repo.update(id, { name: data.name });
    this.logger.log(`Role updated: ${id} in store: ${storeId}`);
    return { success: true };
  }

  async delete(id: string): Promise<Status> {
    const role = await this.repo.findByIdOrThrow(id);
    await this.repo.delete(id);
    this.logger.log(`Role deleted: ${id} in store: ${role.storeId}`);
    return { success: true };
  }

  async attachPermissions(
    id: string,
    permissions: string[],
    storeId: string,
  ): Promise<Status> {
    const role = await this.repo.findByIdOrThrow(id);
    if (role.storeId !== storeId)
      throw new NotFoundException('Role not found in this store');
    const updatedRole = await this.repo.addPermissionsToRole(id, permissions);
    if (!updatedRole) {
      throw new BadRequestException('Failed to add permissions to role');
    }
    this.logger.log(`Permissions added to role: ${id} in store: ${storeId}`);
    return { success: true };
  }

  async detachPermissions(
    id: string,
    permissions: string[],
    storeId: string,
  ): Promise<Status> {
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
    this.logger.log(
      `Permissions removed from role: ${id} in store: ${storeId}`,
    );
    return { success: true };
  }
}
