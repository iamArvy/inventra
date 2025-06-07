import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'product',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../proto/product.proto'),
          url: process.env.GRPC_PRODUCT_URL || 'localhost:50051',
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
  providers: [ProductResolver],
})
export class ProductModule {}
