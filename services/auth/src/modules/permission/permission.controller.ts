import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { IdInput } from 'src/common/dto/app.inputs';
import {
  CreatePermissionInput,
  UpdatePermissionInput,
} from './dto/permission.inputs';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @GrpcMethod('PermissionService', 'Create')
  create(data: CreatePermissionInput) {
    return this.service.create(data);
  }

  @GrpcMethod('PermissionService', 'FindAll')
  list() {
    return this.service.findAll();
  }

  @GrpcMethod('PermissionService', 'FindById')
  findById({ id }: IdInput) {
    return this.service.findById(id);
  }

  @GrpcMethod('PermissionService', 'ListRolePermissions')
  listRolePermissions({ id }: IdInput) {
    return this.service.listRolePermissions(id);
  }

  @GrpcMethod('PermissionService', 'Update')
  update({ id, data }: UpdatePermissionInput) {
    return this.service.update(id, data);
  }

  @GrpcMethod('PermissionService', 'Delete')
  delete({ id }: IdInput) {
    return this.service.delete(id);
  }
}
