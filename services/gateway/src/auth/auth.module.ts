import { RoleController } from './role/role.controller';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../proto/auth.proto'),
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
  controllers: [AuthController, RoleController, UserController],
})
export class AuthModule {}
