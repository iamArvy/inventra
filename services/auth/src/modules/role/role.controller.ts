import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateRoleInput, UpdateRoleInput } from './dto/role.inputs';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('RoleService')
  create(data: CreateRoleInput) {
    return this.service.create(data.storeId, data.data);
  }

  @GrpcMethod('RoleService')
  find({ id }: { id: string }) {
    return this.service.find(id);
  }

  @GrpcMethod('RoleService')
  update({ id, storeId, data }: UpdateRoleInput) {
    return this.service.update(id, storeId, data);
  }

  @GrpcMethod('RoleService')
  list({ id }: { id: string }) {
    return this.service.listByStore(id);
  }

  @GrpcMethod('RoleService')
  delete({ id }: { id: string }) {
    return this.service.delete(id);
  }
}
