import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductGrpcClient } from './product.grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'product',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, '../../../proto/product/product.proto'),
            url: configService.get<string>('PRODUCT_GRPC_URL'),
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
        }),
      },
    ]),
  ],
  providers: [ProductGrpcClient],
  exports: [ClientsModule, ProductGrpcClient],
})
export class ProductGrpcClientModule {}
