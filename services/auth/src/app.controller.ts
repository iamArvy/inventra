import { Controller, Get } from '@nestjs/common';
import { UserEvent } from './messaging/event/user.event';

@Controller()
export class AppController {
  constructor(
    private event: UserEvent,
    // private roleService: RoleService,
  ) {}
  @Get('')
  tester() {
    // this.event.emailVerificationRequested({
    //   token: 'sssss',
    //   email: 'fdfgdfg',
    // });
    // return this.roleService.listByStore('sds');
    // return 'User signed up';
  }
}
