import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGrpcClientModule } from 'grpc-clients/auth/auth.grpc.module';

@Module({
  imports: [AuthGrpcClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
