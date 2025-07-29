import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { NotificationEvents } from './messaging.constants';

@Injectable()
export class BaseClientService<T = string> {
  constructor(
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
  ) {}
  /**
   * Emits an event to the message broker.
   * @param event - The event name to emit.
   * @param data - The data to send with the event.
   */

  emit(event: T, data: Record<string, any>): void {
    // Send a notification event to the message broker
    this.client.emit(event, data);
  }
  // emitNotification(event: string, data: Record<string, any>): void {
  //   // Emit a notification event with the provided data
  //   console.log(`Event: ${event}`, data);
  //   // Here you would typically use a message broker to emit the event
  //   // For example, using a message queue or pub/sub system
  // }
}
