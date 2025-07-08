import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SessionService } from './session.service';
import { IdInput } from 'src/common/dto/app.inputs';
import { Status } from 'src/common/dto/app.response';
import { SessionDto, SessionList } from './session.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly service: SessionService) {}
  @GrpcMethod('AuthService')
  health(): Status {
    return { success: true };
  }

  @GrpcMethod('SessionService')
  getUserActiveSessions({ id }: IdInput): Promise<SessionList> {
    return this.service.getUserActiveSessions(id);
  }

  @GrpcMethod('SessionService')
  logoutOtherSessions({ id }: IdInput): Promise<Status> {
    return this.service.logoutOtherUserSessions(id);
  }

  @GrpcMethod('SessionService')
  get({ id }: IdInput): Promise<SessionDto> {
    return this.service.get(id);
  }
}
