import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepo } from 'src/db/repository/repositories/session.repo';
import { NotFoundException } from '@nestjs/common';

const mockSessionRepo = () => ({
  findUserActiveSessions: jest.fn(),
  endAllUserSessions: jest.fn(),
  findById: jest.fn(),
});

describe('SessionService', () => {
  let service: SessionService;
  let repo: ReturnType<typeof mockSessionRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: SessionRepo, useFactory: mockSessionRepo },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    repo = module.get(SessionRepo);
  });

  describe('getUserActiveSessions', () => {
    it('should return sessions if found', async () => {
      const sessions = [{ id: 's1' }, { id: 's2' }];
      repo.findUserActiveSessions.mockResolvedValue(sessions);

      const result = await service.getUserActiveSessions('user1');
      expect(result.sessions.length).toBe(2);
    });

    it('should return empty array if no sessions found', async () => {
      repo.findUserActiveSessions.mockResolvedValue([]);
      const result = await service.getUserActiveSessions('user1');
      expect(result.sessions).toEqual([]);
    });
  });

  describe('logoutOtherUserSessions', () => {
    it('should logout all other user sessions and clear cache', async () => {
      repo.endAllUserSessions.mockResolvedValue(true);

      const result = await service.logoutOtherUserSessions('user1');
      expect(repo.endAllUserSessions).toHaveBeenCalledWith('user1');
      expect(result.success).toBe(true);
    });
  });

  describe('get', () => {
    it('should return session if found', async () => {
      const session = { id: 's1' };
      repo.findById.mockResolvedValue(session);
      const result = await service.get('s1');
      expect(result).toEqual(session);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.get('s1')).rejects.toThrow(NotFoundException);
    });
  });
});
