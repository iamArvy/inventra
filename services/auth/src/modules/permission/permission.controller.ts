import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { IdInput } from 'src/common/dto/app.inputs';
import { PermissionInput, UpdatePermissionInput } from './permission.inputs';
import { PermissionDto, PermissionList } from './permission.dto';
import { Status } from 'src/common/dto/app.response';

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @GrpcMethod('PermissionService')
  @GrpcMethod('PermissionService')
  create(data: PermissionInput): Promise<PermissionDto> {
    return this.service.create(data);
  }

  @GrpcMethod('PermissionService')
  list(): Promise<PermissionList> {
    return this.service.list();
  }

  @GrpcMethod('PermissionService')
  find({ id }: IdInput): Promise<PermissionDto> {
    return this.service.findById(id);
  }

  @GrpcMethod('PermissionService')
  listRolePermissions({ id }: IdInput): Promise<PermissionList> {
    return this.service.listRolePermissions(id);
  }

  @GrpcMethod('PermissionService')
  update({ id, data }: UpdatePermissionInput): Promise<Status> {
    return this.service.update(id, data);
  }

  @GrpcMethod('PermissionService')
  delete({ id }: IdInput): Promise<Status> {
    return this.service.delete(id);
  }
}
