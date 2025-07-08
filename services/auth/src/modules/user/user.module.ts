import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecretModule } from 'src/common/services/secret/secret.module';
import { TokenModule } from 'src/common/services/token/token.module';

@Module({
  imports: [SecretModule, TokenModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
