import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/modules/user/user.dto';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';
import { ClientEvents } from './client.keys';

@Injectable()
export class ClientEvent extends RabbitmqService {
  created(data: UserDto) {
    this.emit(ClientEvents.CLIENT_CREATED, data);
  }

  // updated(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_UPDATED, data);
  // }

  // emailVerificationRequested(data: { token: string; email: string }) {
  //   this.emit(Events.USER_EMAIL_VERIFICATION_REQUESTED, data);
  // }

  // emailVerified(data: { userId: string; email: string }) {
  //   this.emit(Events.USER_EMAIL_VERIFIED, data);
  // }

  // passwordResetRequested(data: { email: string; token: string }) {
  //   this.emit(Events.USER_PASSWORD_RESET_REQUESTED, data);
  // }

  // newDeviceLogin(data: { id: string; userAgent: string; ipAddress: string }) {
  //   this.emit(Events.USER_NEW_DEVICE_LOGIN, data);
  // }

  // deactivated(id: string) {
  //   this.emit(Events.USER_DEACTIVATED, { id });
  // }
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
