import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepo } from 'src/db/repositories/user.repo';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { TokenService } from 'src/common/services/token/token.service';
import { SecretService } from 'src/common/services/secret/secret.service';
import { UserEvent } from 'src/messaging/event/user.event';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { ClientRepo } from 'src/db/repositories/client.repo';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

// Mocks
const mockUserRepo = () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
});
const mockSessionRepo = () => ({
  findByUserIdAndDevice: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
});
const mockTokenService = () => ({
  generateRefreshToken: jest.fn(),
  generateAccessToken: jest.fn(),
  generateEmailVerificationToken: jest.fn(),
  generateClientToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
});
const mockSecretService = () => ({
  create: jest.fn(),
  compare: jest.fn(),
});
const mockUserEvent = () => ({
  created: jest.fn(),
  emailVerificationRequested: jest.fn(),
  newDeviceLogin: jest.fn(),
});
const mockRoleRepo = () => ({
  createOwner: jest.fn(),
});
const mockClientRepo = () => ({
  findById: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let sessionRepo: ReturnType<typeof mockSessionRepo>;
  let tokenService: ReturnType<typeof mockTokenService>;
  let secretService: ReturnType<typeof mockSecretService>;
  // let userEvent: ReturnType<typeof mockUserEvent>;
  let roleRepo: ReturnType<typeof mockRoleRepo>;
  let clientRepo: ReturnType<typeof mockClientRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepo, useFactory: mockUserRepo },
        { provide: SessionRepo, useFactory: mockSessionRepo },
        { provide: TokenService, useFactory: mockTokenService },
        { provide: SecretService, useFactory: mockSecretService },
        { provide: UserEvent, useFactory: mockUserEvent },
        { provide: RoleRepo, useFactory: mockRoleRepo },
        { provide: ClientRepo, useFactory: mockClientRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(UserRepo);
    sessionRepo = module.get(SessionRepo);
    tokenService = module.get(TokenService);
    secretService = module.get(SecretService);
    // userEvent = module.get(UserEvent);
    roleRepo = module.get(RoleRepo);
    clientRepo = module.get(ClientRepo);
  });

  describe('signup', () => {
    it('should throw if no data', async () => {
      await expect(
        service.signup('store1', null as any, 'agent', 'ip'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({});
      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'a', password: 'b' },
          'agent',
          'ip',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create a user and return tokens', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.createOwner.mockResolvedValue({ id: 'role1' });
      secretService.create.mockResolvedValue('hashed');
      userRepo.create.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        storeId: 'store1',
        roleId: 'role1',
      });
      sessionRepo.create.mockResolvedValue({ id: 'sess1' });
      tokenService.generateAccessToken.mockResolvedValue('access');
      tokenService.generateRefreshToken.mockResolvedValue('refresh');

      const result = await service.signup(
        'store1',
        { name: 'Test User', email: 'test@example.com', password: 'pw' },
        'ua',
        'ip',
      );
      expect(result.access.token).toBe('access');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x', password: 'y' }, 'ua', 'ip'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should login user and return tokens', async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: 'user1',
        passwordHash: 'hashed',
        storeId: 'store1',
        emailVerified: true,
      });
      secretService.compare.mockResolvedValue(true);
      sessionRepo.findByUserIdAndDevice.mockResolvedValue(null);
      sessionRepo.create.mockResolvedValue({ id: 'sess1' });
      tokenService.generateAccessToken.mockResolvedValue('access');
      tokenService.generateRefreshToken.mockResolvedValue('refresh');

      const res = await service.login(
        { email: 'x', password: 'y' },
        'ua',
        'ip',
      );
      expect(res.access.token).toBe('access');
    });
  });

  describe('refreshToken', () => {
    it('should throw if user not found', async () => {
      tokenService.verifyRefreshToken.mockResolvedValue({ sub: 'sess1' });
      sessionRepo.findById.mockResolvedValue({
        id: 'sess1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        hashedRefreshToken: 'hashed',
      });
      secretService.compare.mockResolvedValue(true);
      userRepo.findById.mockResolvedValue(null);
      await expect(service.refreshToken('tok')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a new access token', async () => {
      tokenService.verifyRefreshToken.mockResolvedValue({ sub: 'sess1' });
      sessionRepo.findById.mockResolvedValue({
        id: 'sess1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        hashedRefreshToken: 'hashed',
      });
      secretService.compare.mockResolvedValue(true);
      userRepo.findById.mockResolvedValue({
        id: 'user1',
        storeId: 'store1',
        emailVerified: true,
        roleId: 'role1',
      });
      tokenService.generateAccessToken.mockResolvedValue('newAccess');

      const result = await service.refreshToken('token');
      expect(result.token).toBe('newAccess');
    });
  });

  describe('logout', () => {
    it('should revoke a session', async () => {
      tokenService.verifyRefreshToken.mockResolvedValue({ sub: 'sess1' });
      sessionRepo.findById.mockResolvedValue({
        id: 'sess1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 100000),
        hashedRefreshToken: 'hashed',
      });
      secretService.compare.mockResolvedValue(true);
      sessionRepo.update.mockResolvedValue({});

      const res = await service.logout('token');
      expect(res.success).toBe(true);
    });
  });

  describe('getClientToken', () => {
    it('should throw if client not found', async () => {
      clientRepo.findById.mockResolvedValue(null);
      await expect(service.getClientToken('id', 'secret')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a client token', async () => {
      clientRepo.findById.mockResolvedValue({
        id: 'client1',
        hashedSecret: 'hash',
      });
      secretService.compare.mockResolvedValue(true);
      tokenService.generateClientToken.mockResolvedValue('client-token');

      const result = await service.getClientToken('id', 'secret');
      expect(result).toBe('client-token');
    });
  });
});
