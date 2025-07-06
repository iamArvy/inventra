import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateClientInput, UpdateClientInput } from './dto/client.inputs';
import { IdInput, PermissionsOperations } from 'src/common/dto/app.inputs';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private service: ClientService) {}
  // generate client id and secret (only owners can do this)
  @GrpcMethod('ClientService')
  create({ storeId, data }: CreateClientInput) {
    return this.service.create(storeId, data);
  }

  update({ id, storeId, data }: UpdateClientInput) {
    return this.service.update(id, storeId, data);
  }

  // generate secret
  refreshSecret({ id }: IdInput) {
    return this.service.refreshSecret(id);
  }

  // list client
  list({ id }: IdInput) {
    return this.service.list(id);
  }

  // get client
  get({ id }: IdInput) {
    return this.service.get(id);
  }

  // attach permissions
  attachPermissions({ id, permissions }: PermissionsOperations) {
    return this.service.attachPermissions(id, permissions);
  }

  // detach permissions
  detachPermissions({ id, permissions }: PermissionsOperations) {
    return this.service.detachPermissions(id, permissions);
  }

  // delete client
  delete({ id }: IdInput) {
    return this.service.delete(id);
  }
}
