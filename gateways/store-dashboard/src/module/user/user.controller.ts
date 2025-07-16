import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ReqData } from 'src/common/types';
import {
  UpdateEmailInput,
  UpdatePasswordInput,
  ResetPasswordInput,
} from './user.inputs';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('user/health')
  health() {
    return this.service.health();
  }

  @ApiBearerAuth()
  @Get('me')
  me(@Req() { user }: ReqData) {
    return this.service.get(user.id);
  }

  @ApiBearerAuth()
  @Get('user/:id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiBearerAuth()
  @Get('users')
  list(@Req() { user }: ReqData) {
    return this.service.list(user.store_id);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordInput })
  @Patch('user/update-password')
  updatePassword(
    @Req() { user }: ReqData,
    @Body('data') data: UpdatePasswordInput,
  ) {
    return this.service.updatePassword(user, data);
  }

  @ApiBearerAuth()
  @Patch('user/update-email')
  @ApiBody({ type: UpdateEmailInput })
  updateEmail(@Req() { user }: ReqData, @Body('data') data: UpdateEmailInput) {
    return this.service.updateEmail(user, data);
  }

  @ApiBearerAuth()
  @Post('user/request-email-verification')
  requestEmailVerification(@Req() { user }: ReqData) {
    return this.service.requestEmailVerification(user);
  }

  @Patch('user/verify-email')
  verifyEmail(@Body('token') token: string) {
    return this.service.verifyEmail(token);
  }

  @Post('user/request-password-reset')
  requestPasswordReset(@Req() req: Request, @Body('email') email: string) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    return this.service.requestPasswordReset(email, userAgent, ipAddress);
  }

  @Patch('user/reset-password')
  resetPassword(@Body() { token, password }: ResetPasswordInput) {
    return this.service.resetPassword(token, password);
  }

  @Delete('user/deactivate')
  deactivate(@Req() { user: { id, store_id } }: ReqData) {
    return this.service.deactivate(id, store_id);
  }

  @Delete('deactivate-user/:id')
  deactivateUser(
    @Req() { user: { store_id } }: ReqData,
    @Param('id') id: string,
  ) {
    return this.service.deactivate(id, store_id);
  }
}
