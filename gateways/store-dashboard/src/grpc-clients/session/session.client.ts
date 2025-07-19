import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BaseClient } from '../base.client';
import { Status } from '@common/proto/auth/common';
import { Observable } from 'rxjs';
import {
  SESSION_SERVICE_NAME,
  SessionData,
  SessionList,
  SessionServiceClient,
} from '@common/proto/auth/session';

@Injectable()
export class ClientClient extends BaseClient<SessionServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, SESSION_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }

  getAllUserSessions(id: string): Promise<SessionList> {
    return this.call(this.service.getAllUserSessions({ id }));
  }

  logoutOtherUserSession(id: string): Promise<Status> {
    return this.call(
      this.service.logoutOtherUserSession({
        id,
      }),
    );
  }

  get(id: string): Promise<SessionData> {
    return this.call(
      this.service.get({
        id,
      }),
    );
  }
}
