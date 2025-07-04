import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { RoleData } from 'src/common/dto/app.inputs';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class RoleService extends BaseService {
  constructor(private repo: RoleRepo) {
    super();
  }

  async createRole(data: RoleData) {
    try {
      const role = await this.repo.findRoleByName(data.name);
      if (role) throw new BadRequestException('Role already exists');
      return this.repo.create(data);
    } catch (error) {
      this.handleError(error, 'RoleService.createRole');
    }
  }

  async findAllRoles() {
    try {
      return this.repo.findAll();
    } catch (error) {
      this.handleError(error, 'RoleService.findAllRoles');
    }
  }

  async findRole(id: string) {
    try {
      const role = await this.repo.findById(id);
      if (!role) throw new NotFoundException('Role not found');
      return role;
    } catch (error) {
      this.handleError(error, 'RoleService.findRole');
    }
  }

  async updateRole(id: string, data: RoleData) {
    try {
      await this.repo.findByIdOrThrow(id);
      const exist = await this.repo.findRoleByName(data.name);
      if (exist) throw new BadRequestException('Role with name already exists');
      await this.repo.update(id, { name: data.name });
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.updateRole');
    }
  }

  async deleteRole(id: string) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'RoleService.deleteRole');
    }
  }
}
