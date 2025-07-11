import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { BaseService } from 'src/common/services/base/base.service';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { SessionDto, SessionList } from './session.dto';
import { Status } from 'src/common/dto/app.response';
import { CacheKeys } from 'src/cache/cache-keys';
import { Cached } from 'src/common/decorators/cache.decorator';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    private readonly repo: SessionRepo,
    private cache: CacheService,
  ) {
    super();
  }

  @Cached<SessionList>('4h', (id: string) => CacheKeys.userActiveSession(id))
  async getUserActiveSessions(id: string): Promise<SessionList> {
    try {
      const sessions = await this.repo.findUserActiveSessions(id);
      if (!sessions || sessions.length === 0) {
        this.logger.warn(`No active sessions found for user ${id}`);
        return { sessions: [] };
      }
      this.logger.log(
        `Found ${sessions.length} active sessions for user ${id}`,
      );
      return { sessions };
    } catch (error) {
      this.handleError(error, 'SessionService.getUserActiveSessions');
    }
  }

  async logoutOtherUserSessions(id: string): Promise<Status> {
    try {
      await this.repo.endAllUserSessions(id);
      this.logger.log(`All other sessions for user ${id} have been logged out`);
      await this.cache.delete(`user:${id}:activeSessions`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'SessionService.logoutOtherUserSessions');
    }
  }

  @Cached<SessionDto>('1h', (id: string) => CacheKeys.session(id))
  async get(id: string): Promise<SessionDto> {
    try {
      const session = await this.repo.findById(id);
      if (!session) throw new NotFoundException('Session not found');
      return session;
    } catch (error) {
      this.handleError(error, 'SessionService.get');
    }
  }
}
