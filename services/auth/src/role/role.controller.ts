import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @GrpcMethod('RoleService', 'health')
  health() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @GrpcMethod('RoleService', 'create')
  createRole(data: { name: string; description?: string }) {
    const role = this.roleService.createRole(data);
    return role;
  }

  @GrpcMethod('RoleService', 'roles')
  async getRoles() {
    const roles = await this.roleService.findAllRoles();
    console.log('Roles fetched:', roles);
    return { roles: roles };
  }

  @GrpcMethod('RoleService', 'role')
  getRole(data: { id: string }) {
    const role = this.roleService.findRole(data.id);
    return role;
  }

  @GrpcMethod('RoleService', 'delete')
  async deleteRole(data: { id: string }) {
    await this.roleService.deleteRole(data.id);
    return true;
  }
}
