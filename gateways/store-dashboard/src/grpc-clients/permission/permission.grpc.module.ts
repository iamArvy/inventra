import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PermissionGrpcClient } from './permission.grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'permission',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(__dirname, '../../../proto/auth/auth.proto'),
            url: configService.get<string>('AUTH_GRPC_URL'),
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
  providers: [PermissionGrpcClient],
  exports: [ClientsModule, PermissionGrpcClient],
})
export class PermissionGrpcClientModule {}
