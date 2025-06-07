import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'store',
        protoPath: join(__dirname, '../proto/store.proto'),
        url: process.env.GRPC_URL || undefined,
      },
    },
  );
  console.log(process.env.GRPC_URL);
  await app.listen();
}
bootstrap();
