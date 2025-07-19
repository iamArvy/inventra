import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BaseClient } from '../base.client';
import { Status } from '@common/proto/auth/common';
import { Observable } from 'rxjs';
import {
  CreateRoleData,
  ROLE_SERVICE_NAME,
  RoleData,
  RoleList,
  RoleServiceClient,
  UpdateRoleData,
} from '@common/proto/auth/role';

@Injectable()
export class ClientClient extends BaseClient<RoleServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, ROLE_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }

  create(
    id: string,
    data: CreateRoleData,
    permissions: string[],
  ): Promise<RoleData> {
    return this.call(
      this.service.create({
        id,
        data,
        permissions,
      }),
    );
  }

  update(id: string, data: UpdateRoleData): Promise<Status> {
    return this.call(
      this.service.update({
        id,
        data,
      }),
    );
  }

  get(id: string): Promise<RoleData> {
    return this.call(
      this.service.find({
        id,
      }),
    );
  }

  // make list by store and normal list in the microservice
  list(id: string): Promise<RoleList> {
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
