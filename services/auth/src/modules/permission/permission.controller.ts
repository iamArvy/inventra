import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @GrpcMethod('PermissionService', 'Create')
  create(data: { name: string; description?: string }) {
    return this.service.create(data);
  }

  @GrpcMethod('PermissionService', 'FindAll')
  findAll() {
    return this.service.findAll();
  }

  @GrpcMethod('PermissionService', 'FindById')
  findById(data: { id: string }) {
    return this.service.findById(data.id);
  }

  @GrpcMethod('PermissionService', 'ListRolePermissions')
  listRolePermissions(data: { roleId: string }) {
    return this.service.listRolePermissions(data.roleId);
  }

  @GrpcMethod('PermissionService', 'Update')
  update(data: { id: string; name?: string; description?: string }) {
    return this.service.update(data.id, {
      name: data.name,
      description: data.description,
    });
  }

  @GrpcMethod('PermissionService', 'Delete')
  delete(data: { id: string }) {
    return this.service.delete(data.id);
  }
}
