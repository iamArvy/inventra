import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: [
        'auth.proto',
        'client.proto',
        'permission.proto',
        'role.proto',
        'session.proto',
        'user.proto',
      ],
      url: process.env.GRPC_URL,
      loader: {
        // arrays: true,
        // objects: true,
        includeDirs: ['proto'],
        // keepCase: true,
        // longs: String,
        // defaults: true,
        // oneofs: true,
        // enums: String,
      },
    },
  });
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
