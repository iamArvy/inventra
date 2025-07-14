import { Global, Module } from '@nestjs/common';
import { UserSeeder } from './seeders/user.seeder';
import { PermissionSeeder } from './seeders/permission.seeder';
import { RepositoryModule } from '../repository/repository.module';

@Global()
@Module({
  imports: [RepositoryModule],
  providers: [PermissionSeeder, UserSeeder],
})
export class SeederModule {}
