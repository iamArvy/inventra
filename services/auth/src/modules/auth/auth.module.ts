import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from 'src/common/services/token/token.module';
import { SecretModule } from 'src/common/services/secret/secret.module';

@Module({
  imports: [TokenModule, SecretModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
