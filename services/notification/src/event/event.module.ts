import { Module } from '@nestjs/common';
import { AuthEventHandler } from './handler/auth.handler';

@Module({
  controllers: [AuthEventHandler],
})
// The EventModule is responsible for handling events related to notifications.
// It imports the AuthEventHandler which listens for specific events like email verification.
// This module can be expanded in the future to include more event handlers as needed.
// It does not export any providers, as it is intended to be used internally within the notification
// service. If you need to expose any functionality to other modules, you can add exports here
export class EventModule {}
