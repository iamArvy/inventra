import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
  ) {}

  emit<T>(event: T, data: Record<string, any>): void {
    // Send a notification event to the message broker
    this.client.emit(event, data);
  }
}
