import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../protos/auth.proto'),
        url: process.env.GRPC_URL ?? 'localhost:5000',
        // loader: {
        //   keepCase: true,
        //   longs: String,
        //   enums: String,
        //   defaults: true,
        //   arrays: true,
        //   objects: true,
        //   oneofs: true,
        // },
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // }
    }),
  );
  console.log(
    'GRPC Server is running on',
    process.env.GRPC_URL ?? 'localhost:5000',
  );
  await app.listen();
}
bootstrap();
