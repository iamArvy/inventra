import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateEmailInput, UpdatePasswordInput } from './dto/user.inputs';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('')
  // GetUsers() {
  //   const users = this.userService.
  // }
  @GrpcMethod('UserService', 'health')
  health() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @GrpcMethod('UserService', 'updatePassword')
  async updatePassword(data: UpdatePasswordInput) {
    await this.userService.updateUserPassword(data.id, data);
    return { success: true };
  }

  @GrpcMethod('UserService', 'updateEmail')
  async updateEmail(data: UpdateEmailInput) {
    await this.userService.updatedUserEmail(data.id, data);
    return { success: true };
  }

  // @GrpcMethod('UserService', 'delete')
  // deleteUser() {}

  @GrpcMethod('UserService', 'assignRole')
  async assignRole(data: { id: string; role_id: string }) {
    await this.userService.assignRole(data.id, data.role_id);
    return { success: true };
  }

  @GrpcMethod('UserService', 'removeRole')
  async removeRole(data: { id: string; role_id: string }) {
    await this.userService.removeRole(data.id, data.role_id);
    return { success: true };
  }

  // @Post('create-admin')
  // async createAdmin(@Body() data: {} ) {}
}
