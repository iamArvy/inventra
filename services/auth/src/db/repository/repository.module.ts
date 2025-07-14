import { Global, Module } from '@nestjs/common';
import { SessionRepo } from './repositories/session.repo';
import { PrismaService } from '../prisma.service';
import { RoleRepo } from './repositories/role.repo';
import { PermissionRepo } from './repositories/permission.repo';
import { ClientRepo } from './repositories/client.repo';
import { UserRepo } from './repositories/user.repo';

@Global()
@Module({
  providers: [
    UserRepo,
    SessionRepo,
    PrismaService,
    RoleRepo,
    PermissionRepo,
    ClientRepo,
  ],
  exports: [UserRepo, SessionRepo, RoleRepo, PermissionRepo, ClientRepo],
})
export class RepositoryModule {}
