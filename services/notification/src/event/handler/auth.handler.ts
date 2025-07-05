import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RMQ_EVENTS } from '../constants/event.constant';

@Controller()
export class AuthEventHandler {
  constructor() {}

  /**
   * Handles the email verification event.
   * @param data - The data containing userId and email.
   */
  @EventPattern(RMQ_EVENTS.EMAIL_VERIFICATION)
  handleEmailVerification(@Payload() data: any) {
    // send verification email
    console.log('Sending email verification to', data);
  }
}
