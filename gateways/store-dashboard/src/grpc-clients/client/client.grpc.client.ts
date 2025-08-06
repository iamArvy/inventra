import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BaseClient } from '../base.client';
import {
  CLIENT_SERVICE_NAME,
  ClientData,
  ClientInput,
  ClientList,
  ClientServiceClient,
  UpdateClientData,
} from 'common/proto/auth/client';
import { Status } from 'common/proto/auth/common';
import { Observable } from 'rxjs';

@Injectable()
export class ClientGrpcClient extends BaseClient<ClientServiceClient> {
  constructor(@Inject('client') client: ClientGrpc) {
    super(client, CLIENT_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }

  create(
    id: string,
    data: ClientInput,
    permissions: string[],
  ): Promise<ClientData> {
    return this.call(
      this.service.create({
        id,
        data,
        permissions,
      }),
    );
  }

  update(id: string, storeId: string, data: UpdateClientData): Promise<Status> {
    return this.call(
      this.service.update({
        id,
        data,
        storeId,
      }),
    );
  }

  get(id: string): Promise<ClientData> {
    return this.call(
      this.service.get({
        id,
      }),
    );
  }

  list(id: string): Promise<ClientList> {
    return this.call(
      this.service.list({
        id,
      }),
    );
  }

  delete(id: string): Promise<Status> {
    return this.call(
      this.service.delete({
        id,
      }),
    );
  }

  refreshSecret(id: string) {
    return this.call(
      this.service.refreshSecret({
        id,
      }),
    );
  }

  attachPermissions(id: string, permissionIds: string[]): Promise<Status> {
    return this.call(
      this.service.attachPermissions({
        id,
        permissionIds,
      }),
    );
  }

  detachPermissions(id: string, permissionIds: string[]): Promise<Status> {
    return this.call(
      this.service.detachPermissions({
        id,
        permissionIds,
      }),
    );
  }
}
