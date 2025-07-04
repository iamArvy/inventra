import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { DbModule } from 'src/db/db.module';
import { BaseModule } from 'src/common/base/base.module';

@Module({
  imports: [DbModule, BaseModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
