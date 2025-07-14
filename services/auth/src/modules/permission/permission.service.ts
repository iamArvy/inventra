import { Injectable, Logger } from '@nestjs/common';
import { PermissionRepo } from 'src/db/repository';
import { PermissionDto, PermissionList } from './permission.dto';
import { PermissionInput } from './permission.inputs';
import { Status } from 'src/common/dto/app.response';

@Injectable()
export class PermissionService {
  constructor(private readonly repo: PermissionRepo) {}

  protected readonly logger = new Logger(this.constructor.name);

  // create
  async create(data: { name: string; description?: string }) {
    const permission = await this.repo.create(data);
    if (!permission) {
      throw new Error('Failed to create permission');
    }
    this.logger.log(`Permission created: ${permission.id}`);
    return permission;
  }

  // findAll
  async list(): Promise<PermissionList> {
    const permissions = await this.repo.list();
    return { permissions };
  }

  // findById
  async findById(id: string): Promise<PermissionDto> {
    const permission = await this.repo.findById(id);
    if (!permission) {
      throw new Error('Permission not found');
    }
    return permission;
  }
  // listRolePermissions
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
    return { success: true };
  }

  // delete
  async delete(id: string): Promise<Status> {
    const permission = await this.repo.findByIdOrThrow(id);
    await this.repo.delete(id);
    this.logger.log(`Permission deleted: ${permission.id}`);
    return { success: true };
  }
}
