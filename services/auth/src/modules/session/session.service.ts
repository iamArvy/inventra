import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { BaseService } from 'src/common/services/base/base.service';
import { SessionRepo } from 'src/db/repositories/session.repo';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    private readonly repo: SessionRepo,
    private cache: CacheService,
  ) {
    super();
  }
  async getUserActiveSessions(id: string) {
    try {
      const sessions = await this.repo.findUserActiveSessions(id);
      if (!sessions || sessions.length === 0) {
        this.logger.warn(`No active sessions found for user ${id}`);
        return { sessions: [] };
      }
      this.logger.log(
        `Found ${sessions.length} active sessions for user ${id}`,
      );
      await this.cache.set(`user:${id}:activeSessions`, sessions, '1h');
      return { sessions };
    } catch (error) {
      this.handleError(error, 'SessionService.getUserActiveSessions');
    }
  }

  async logoutOtherUserSessions(id: string) {
    try {
      await this.repo.endAllUserSessions(id);
      this.logger.log(`All other sessions for user ${id} have been logged out`);
      await this.cache.delete(`user:${id}:activeSessions`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'SessionService.logoutOtherUserSessions');
    }
  }
}
