import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { SecretModule } from 'src/common/secret/secret.module';
import { BaseModule } from 'src/common/base/base.module';
import { TokenModule } from 'src/common/token/token.module';

@Module({
  imports: [DbModule, SecretModule, BaseModule, TokenModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
