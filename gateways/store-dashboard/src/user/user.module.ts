import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserGrpcClientModule } from 'grpc-clients/user/user.grpc.module';

@Module({
  imports: [UserGrpcClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
