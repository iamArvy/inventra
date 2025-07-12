import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { SessionDto, SessionList } from './session.dto';
import { Status } from 'src/common/dto/app.response';
import { CacheKeys } from 'src/cache/cache-keys';
import { Cached } from 'src/common/decorators/cache.decorator';

@Injectable()
export class SessionService {
  constructor(
    private readonly repo: SessionRepo,
    private cache: CacheService,
  ) {}

  protected readonly logger = new Logger(this.constructor.name);

  @Cached<SessionList>('4h', (id: string) => CacheKeys.userActiveSession(id))
  async getUserActiveSessions(id: string): Promise<SessionList> {
    const sessions = await this.repo.findUserActiveSessions(id);
    if (!sessions || sessions.length === 0) {
      this.logger.warn(`No active sessions found for user ${id}`);
      return { sessions: [] };
    }
    this.logger.log(`Found ${sessions.length} active sessions for user ${id}`);
    return { sessions };
  }

  async logoutOtherUserSessions(id: string): Promise<Status> {
    await this.repo.endAllUserSessions(id);
    this.logger.log(`All other sessions for user ${id} have been logged out`);
    await this.cache.delete(`user:${id}:activeSessions`);
    return { success: true };
  }

  @Cached<SessionDto>('1h', (id: string) => CacheKeys.session(id))
  async get(id: string): Promise<SessionDto> {
    const session = await this.repo.findById(id);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }
}
