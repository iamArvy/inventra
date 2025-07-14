import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserEvent } from './event/user.event';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MESSAGE_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RMQ_URL') || 'amqp://localhost:5672'],
            exchange: 'app_exchange',
            exchangeType: 'topic',
            routingKey: '',
            queue: '',
            queueOptions: {
              durable: true,
            },
            wildcards: true, // Enable wildcards for routing keys
          },
        }),
      },
    ]),
  ],
  providers: [UserEvent],
  exports: [UserEvent],
})
@Global()
export class MessagingModule {}
