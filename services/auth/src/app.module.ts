import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ClientModule } from './modules/client/client.module';
import { RoleModule } from './modules/role/role.module';
import { SessionModule } from './modules/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { MessagingModule } from './messaging/messaging.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RepositoryModule } from './db/repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ClientModule,
    RoleModule,
    SessionModule,
    PassportModule,
    MessagingModule,
    PermissionModule,
    RepositoryModule,
  ],
})
export class AppModule {}
