import { Global, Module } from '@nestjs/common';
import { SessionRepo } from './repositories/session.repo';
import { UserRepo } from './repositories/user.repo';
import { PrismaService } from './prisma.service';
import { RoleRepo } from './repositories/role.repo';
import { PermissionSeeder } from './seeder/permission.seeder';
import { PermissionRepo } from './repositories/permission.repo';
import { ClientRepo } from './repositories/client.repo';

@Global()
@Module({
  providers: [
    UserRepo,
    SessionRepo,
    PrismaService,
    RoleRepo,
    PermissionSeeder,
    PermissionRepo,
    ClientRepo,
  ],
  exports: [UserRepo, SessionRepo, RoleRepo, PermissionRepo, ClientRepo],
})
export class DbModule {}
