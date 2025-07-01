import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductController } from './product.controller';
import { ProductService } from './services/product/product.service';
import { AttributeService } from './services/attributes/attribute.service';
import { VariantService } from './services/variant/variant.service';

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
            protoPath: join(__dirname, '../../../proto/product.proto'),
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
  providers: [ProductService, AttributeService, VariantService],
  controllers: [ProductController],
})
export class ProductModule {}
