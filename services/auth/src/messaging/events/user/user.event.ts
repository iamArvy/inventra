import { Injectable } from '@nestjs/common';
import { UserEvents } from './user.keys';
import { UserDto } from 'src/modules/user/user.dto';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';

@Injectable()
export class UserEvent {
  constructor(private readonly rmq: RabbitmqService) {}
  created(data: UserDto) {
    this.rmq.emit(UserEvents.USER_CREATED, data);
  }

  updated(data: { userId: string; email: string }) {
    this.rmq.emit(UserEvents.USER_UPDATED, data);
  }

  emailVerificationRequested(data: { token: string; email: string }) {
    this.rmq.emit(UserEvents.USER_EMAIL_VERIFICATION_REQUESTED, data);
  }

  emailVerified(data: { userId: string; email: string }) {
    this.rmq.emit(UserEvents.USER_EMAIL_VERIFIED, data);
  }

  passwordResetRequested(data: { email: string; token: string }) {
    this.rmq.emit(UserEvents.USER_PASSWORD_RESET_REQUESTED, data);
  }

  newDeviceLogin(data: { id: string; userAgent: string; ipAddress: string }) {
    this.rmq.emit(UserEvents.USER_NEW_DEVICE_LOGIN, data);
  }

  deactivated(id: string) {
    this.rmq.emit(UserEvents.USER_DEACTIVATED, { id });
  }
  // passwordChanged(data: { userId: string }) {
  //   this.emit(Events.USER_PASSWORD_CHANGED, data);
  // }
  // authenticated(data: { userId: string }) {
  //   this.emit(Events.USER_AUTHENTICATED, data);
  // }
  // profileUpdated(data: { userId: string }) {
  //   this.emit(Events.USER_PROFILE_UPDATED, data);
  // }
  // deleted(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_DELETED, data);
  // }
  // emailVerified(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_EMAIL_VERIFIED, data);
  // }
  // accountLocked(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_ACCOUNT_LOCKED, data);
  // }
  // accountUnlocked(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_ACCOUNT_UNLOCKED, data);
  // }
}
