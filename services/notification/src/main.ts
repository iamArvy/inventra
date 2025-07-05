import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      exchange: 'app_exchange',
      exchangeType: 'topic',
      routingKey: '#',
      queue: 'notifications_queue',
      queueOptions: { durable: true },
      wildcards: true, // Enable wildcards for routing keys
    },
  });
  await app.startAllMicroservices();
  // await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
