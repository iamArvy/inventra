import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'store',
        transport: Transport.GRPC,
        options: {
          package: 'store',
          protoPath: join(__dirname, '../../../protos/store.proto'),
          // url: 'localhost:50051',
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
  controllers: [StoreController],
})
export class StoreModule {}
