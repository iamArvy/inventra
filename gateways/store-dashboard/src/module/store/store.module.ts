import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'store',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'store',
            protoPath: join(__dirname, '../../../proto/store.proto'),
            url: configService.get<string>('STORE_GRPC_URL'),
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
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
