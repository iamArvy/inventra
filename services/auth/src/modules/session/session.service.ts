import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SessionRepo } from 'src/db/repository';
import { SessionDto, SessionList } from './session.dto';
import { Status } from 'src/common/dto/app.response';

@Injectable()
export class SessionService {
  constructor(private readonly repo: SessionRepo) {}

  protected readonly logger = new Logger(this.constructor.name);

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
    return { success: true };
  }

  async get(id: string): Promise<SessionDto> {
    const session = await this.repo.findById(id);
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }
}
