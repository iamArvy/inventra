import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserEvent } from './event/user.event';
// import { BaseClientService } from './rmq/rmq.client';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          exchange: 'app_exchange',
          exchangeType: 'topic',
          routingKey: '',
          queue: '',
          queueOptions: {
            durable: true,
          },
          wildcards: true, // Enable wildcards for routing keys
        },
      },
    ]),
  ],
  providers: [UserEvent],
  exports: [UserEvent],
})
@Global()
export class MesssagingModule {}
