import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { RestAuthGuard } from 'src/guards';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { ClientGrpc } from '@nestjs/microservices';
import { RoleService } from './role.interface';
import { HealthResponse } from 'src/dto/status.response';

@Controller('roles')
@ApiBearerAuth()
@UseGuards(RestAuthGuard, RolesGuard) // You can add your custom guards here if neede
export class RoleController implements OnModuleInit {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private roleService: RoleService;
  onModuleInit() {
    this.roleService = this.client.getService<RoleService>('RoleService');
  }

  @ApiOkResponse({
    description: 'Health check for user service',
    type: HealthResponse,
  })
  @Get('health')
  health() {
    return this.roleService.health({});
  }

  @Put('create')
  createRole(@Body() data: { name: string; description?: string }) {
    return this.roleService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @Roles('superuser') // Specify the roles that can access this endpoint
  getRoles() {
    return this.roleService.roles({});
  }

  @Get(':id')
  getRole(@Param('id') id: string) {
    return this.roleService.role({ id });
  }

  @Delete(':id/delete')
  deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole({ id });
  }
}
