import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  HealthImplementation,
  protoPath as healthCheckProtoPath,
} from 'grpc-health-check';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: [healthCheckProtoPath, 'product.proto', 'category.proto'],
      url: process.env.GRPC_URL ?? 'localhost:5000',
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
      onLoadPackageDefinition: (pkg, server) => {
        const healthImpl = new HealthImplementation({
          '': 'UNKNOWN',
        });

        healthImpl.addToServer(server);
        healthImpl.setStatus('', 'SERVING');
      },
    },
  });
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
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
