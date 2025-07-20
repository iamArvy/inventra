import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateRoleInput, UpdateRoleInput } from './role.inputs';
import { RoleService } from './role.service';
import { PermissionsOperations } from 'src/common/dto/app.inputs';
import { RoleDto, RoleList } from './role.dto';
import { Status } from 'src/common/dto/app.response';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('RoleService')
  create({ id, data, permissions }: CreateRoleInput): Promise<RoleDto> {
    return this.service.create(id, data, permissions);
  }

  @GrpcMethod('RoleService')
  get({ id }: { id: string }): Promise<RoleDto> {
    return this.service.get(id);
  }

  @GrpcMethod('RoleService')
  update({ id, storeId, data }: UpdateRoleInput): Promise<Status> {
    return this.service.update(id, storeId, data);
  }

  @GrpcMethod('RoleService')
  listByStore({ id }: { id: string }): Promise<RoleList> {
    return this.service.listByStore(id);
  }

  @GrpcMethod('RoleService')
  list(): Promise<RoleList> {
    return this.service.list();
  }

  @GrpcMethod('RoleService')
  delete({ id }: { id: string }): Promise<Status> {
    return this.service.delete(id);
  }

  @GrpcMethod('RoleService')
  attachPermissions({
    id,
    storeId,
    permissions,
  }: PermissionsOperations): Promise<Status> {
    return this.service.attachPermissions(id, permissions, storeId);
  }

  @GrpcMethod('RoleService')
  detachPermissions({
    id,
    storeId,
    permissions,
  }: PermissionsOperations): Promise<Status> {
    return this.service.detachPermissions(id, permissions, storeId);
  }

  @Get('')
  tester() {
    // this.event.emailVerificationRequested({
    //   token: 'sssss',
    //   email: 'fdfgdfg',
    // });
    return this.service.listByStore('sds');
    // return 'User signed up';
  }
}
