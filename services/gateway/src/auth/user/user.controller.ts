import {
  Body,
  Controller,
  Get,
  // Delete,
  Inject,
  OnModuleInit,
  // Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateEmailInput, UpdatePasswordInput } from './dto/user.inputs';
import { RestAuthGuard } from 'src/guards';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { UserService } from './user.interface';
import { RolesGuard } from 'src/guards/roles.guard';
import { HealthResponse } from 'src/dto/status.response';

@ApiBearerAuth()
@UseGuards(RestAuthGuard, RolesGuard)
@Controller('users')
export class UserController implements OnModuleInit {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private userService: UserService;
  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }
  // constructor(private readonly userService: UserService) {}

  // @Get('')
  // GetUsers() {
  //   const users = this.userService.
  // }

  @ApiOkResponse({
    description: 'Health check for user service',
    type: HealthResponse,
  })
  @Get('health')
  health() {
    return this.userService.health({});
  }

  @Post(':id/roles/add')
  AddRolesToUser() {}

  @Post(':id/roles/remove')
  RemoveRolesForUser() {}

  @Post('update-password')
  updatePassword(
    @Req() req: { user: { id: string } },
    @Body('data') data: UpdatePasswordInput,
  ) {
    this.userService.updatePassword({ id: req.user.id, ...data });
    return true;
  }

  @Post(':id/update-email')
  updateEmail(
    @Req() req: { user: { id: string } },
    @Body('data') data: UpdateEmailInput,
  ) {
    return this.userService.updateEmail({ id: req.user.id, ...data });
  }

  // @Delete(':id/delete')
  // deleteUser(@Req() req: { user: { id: string } }) {
  //   return this.userService.DeleteUser({ id: req.user.id });
  // }

  // @Post('create-admin')
  // async createAdmin(@Body() data: {} ) {}
}
