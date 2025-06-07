import {
  Body,
  Controller,
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { RolesGuard } from 'src/guards/roles.guard';
import { USER_SERVICE_NAME, UserServiceClient } from 'src/generated/auth';

@ApiBearerAuth()
@UseGuards(RestAuthGuard, RolesGuard)
@Controller('users')
export class UserController implements OnModuleInit {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private userService: UserServiceClient;
  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

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
