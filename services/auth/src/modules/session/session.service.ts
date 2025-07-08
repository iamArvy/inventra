import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { BaseService } from 'src/common/services/base/base.service';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { SessionDto, SessionList } from './session.dto';
import { Status } from 'src/common/dto/app.response';
import { CacheKeys } from 'src/cache/cache-keys';

@Injectable()
export class SessionService extends BaseService {
  constructor(
    private readonly repo: SessionRepo,
    private cache: CacheService,
  ) {
    super();
  }
  async getUserActiveSessions(id: string): Promise<SessionList> {
    try {
      const cachedSessions = await this.cache.get<SessionDto[]>(
        CacheKeys.userActiveSession(id),
      );
      if (cachedSessions) {
        return { sessions: cachedSessions };
      }
      const sessions = await this.repo.findUserActiveSessions(id);
      if (!sessions || sessions.length === 0) {
        this.logger.warn(`No active sessions found for user ${id}`);
        return { sessions: [] };
      }
      this.logger.log(
        `Found ${sessions.length} active sessions for user ${id}`,
      );
      await this.cache.set(CacheKeys.userActiveSession(id), sessions, '1h');
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

  async get(id: string): Promise<SessionDto> {
    try {
      const cachedSession = await this.cache.get<SessionDto>(
        CacheKeys.session(id),
      );
      if (cachedSession) {
        return cachedSession;
      }

      const session = await this.repo.findById(id);
      if (!session) throw new NotFoundException('Session not found');
      await this.cache.set(CacheKeys.session(id), session, '1h');
      return session;
    } catch (error) {
      this.handleError(error, 'SessionService.get');
    }
  }
}
