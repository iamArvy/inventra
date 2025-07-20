import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BaseClient } from '../base.client';
import { Status } from '@common/proto/auth/common';
import { Observable } from 'rxjs';
import {
  PERMISSION_SERVICE_NAME,
  PermissionData,
  PermissionList,
  PermissionServiceClient,
} from '@common/proto/auth/permission';

@Injectable()
export class PermissionClient extends BaseClient<PermissionServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, PERMISSION_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }

  get(id: string): Promise<PermissionData> {
    return this.call(
      this.service.get({
        id,
      }),
    );
  }

  list(id: string): Promise<PermissionList> {
    return this.call(
      this.service.list({
        id,
      }),
    );
  }

  listRolePermission(id: string): Promise<PermissionList> {
    return this.call(this.service.listRolePermissions({ id }));
  }
}
