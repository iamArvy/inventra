import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ReqData } from 'src/common/types';
import { UpdateEmailInput, UpdatePasswordInput } from './user.inputs';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get('health')
  health() {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post('update-password')
  updatePassword(
    @Req() { user }: ReqData,
    @Body('data') data: UpdatePasswordInput,
  ) {
    return this.service.updatePassword(user, data);
  }

  @Post(':id/update-email')
  updateEmail(@Req() { user }: ReqData, @Body('data') data: UpdateEmailInput) {
    return this.service.updateEmail(user, data);
  }
}
