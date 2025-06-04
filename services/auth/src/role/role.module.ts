import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService], // Exporting RoleService to be used in other modules
})
export class RoleModule {}
