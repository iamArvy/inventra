import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'product',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../../protos/auth.proto'),
          url: process.env.GRPC_AUTH_URL || 'localhost:50051',
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
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
