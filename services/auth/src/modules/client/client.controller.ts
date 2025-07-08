import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateClientInput, UpdateClientInput } from './client.inputs';
import { IdInput, PermissionsOperations } from 'src/common/dto/app.inputs';
import { ClientService } from './client.service';
import { Status } from 'src/common/dto/app.response';
import { ClientDto, ClientList } from './client.dto';

@Controller('client')
export class ClientController {
  constructor(private service: ClientService) {}
  // generate client id and secret (only owners can do this)
  @GrpcMethod('ClientService')
  create({ id, data, permissions }: CreateClientInput) {
    return this.service.create(id, data, permissions);
  }

  @GrpcMethod('ClientService')
  update({ id, storeId, data }: UpdateClientInput) {
    return this.service.update(id, storeId, data);
  }

  @GrpcMethod('ClientService')
  refreshSecret({ id }: IdInput) {
    return this.service.refreshSecret(id);
  }

  @GrpcMethod('ClientService')
  list({ id }: IdInput): Promise<ClientList> {
    return this.service.list(id);
  }

  @GrpcMethod('ClientService')
  get({ id }: IdInput): Promise<ClientDto> {
    return this.service.get(id);
  }

  @GrpcMethod('ClientService')
  attachPermissions({
    id,
    permissions,
  }: PermissionsOperations): Promise<Status> {
    return this.service.attachPermissions(id, permissions);
  }

  @GrpcMethod('ClientService')
  detachPermissions({
    id,
    permissions,
  }: PermissionsOperations): Promise<Status> {
    return this.service.detachPermissions(id, permissions);
  }

  @GrpcMethod('ClientService')
  delete({ id }: IdInput): Promise<Status> {
    return this.service.delete(id);
  }
}
