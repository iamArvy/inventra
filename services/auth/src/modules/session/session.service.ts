import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/base.service';
import { SessionRepo } from 'src/db/repositories/session.repo';

@Injectable()
export class SessionService extends BaseService {
  constructor(private readonly repo: SessionRepo) {
    super();
  }
  async getUserActiveSessions(id: string) {
    try {
      const sessions = await this.repo.findUserActiveSessions(id);
      return { sessions };
    } catch (error) {
      this.handleError(error, 'SessionService.getUserActiveSessions');
    }
  }

  async logoutOtherUserSessions(id: string) {
    try {
      await this.repo.endAllUserSessions(id);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'SessionService.logoutOtherUserSessions');
    }
  }
}
