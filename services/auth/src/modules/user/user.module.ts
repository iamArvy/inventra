import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SecretModule } from 'src/common/services/secret/secret.module';
import { TokenModule } from 'src/common/services/token/token.module';
import { UserRepo } from 'src/db/repository';
import { IdPipe } from 'src/common/pipes/id.pipe';

@Module({
  imports: [SecretModule, TokenModule],
  providers: [
    UserService,
    { provide: 'REPO_TOKEN', useExisting: UserRepo },
    IdPipe,
  ],
  controllers: [UserController],
})
export class UserModule {}
