import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from 'src/db/db.module';
import { TokenModule } from 'src/common/token/token.module';
import { SecretModule } from 'src/common/secret/secret.module';
import { BaseModule } from 'src/common/base/base.module';

@Module({
  imports: [DbModule, TokenModule, SecretModule, BaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
