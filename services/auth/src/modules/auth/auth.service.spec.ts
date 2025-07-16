import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepo, RoleRepo, SessionRepo, ClientRepo } from 'src/db/repository';
import { TokenService } from 'src/common/services/token/token.service';
import { SecretService } from 'src/common/services/secret/secret.service';
import { UserEvent } from 'src/messaging/event/user.event';
import {
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from 'src/common/helpers/grpc-exception';

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
  refresh: jest.fn(),
  access: jest.fn(),
  emailVerification: jest.fn(),
  client: jest.fn(),
  verify: jest.fn(),
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
  findRoleByNameAndStore: jest.fn(),
});
const mockClientRepo = () => ({
  findById: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let sessionRepo: ReturnType<typeof mockSessionRepo>;
  let token: ReturnType<typeof mockTokenService>;
  let secretService: ReturnType<typeof mockSecretService>;
  let userEvent: ReturnType<typeof mockUserEvent>;
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
    token = module.get(TokenService);
    secretService = module.get(SecretService);
    userEvent = module.get(UserEvent);
    roleRepo = module.get(RoleRepo);
    clientRepo = module.get(ClientRepo);
  });

  describe('signup', () => {
    it('should throw if user already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 'id' });
      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'a', password: 'b' },
          'agent',
          'ip',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if owner already exists for store', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.findRoleByNameAndStore.mockResolvedValue({ id: 'id' });
      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'a', password: 'b' },
          'agent',
          'ip',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if role creation fails', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.findRoleByNameAndStore.mockResolvedValue(null);
      roleRepo.createOwner.mockResolvedValue(null);

      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'test@example.com', password: 'pw' },
          'ua',
          'ip',
        ),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw an error if user creation fails', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.findRoleByNameAndStore.mockResolvedValue(null);
      roleRepo.createOwner.mockResolvedValue({ id: 'role1' });
      secretService.create.mockResolvedValue('hashed');
      userRepo.create.mockResolvedValue(null);

      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'test@example.com', password: 'pw' },
          'ua',
          'ip',
        ),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('should throw an error if session creation fails', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.createOwner.mockResolvedValue({ id: 'role1' });
      secretService.create.mockResolvedValue('hashed');
      userRepo.create.mockResolvedValue({
        id: 'user1',
        email: 'test@example.com',
        storeId: 'store1',
        roleId: 'role1',
      });

      token.emailVerification.mockResolvedValue({
        token: 'email-verification-token',
      });
      sessionRepo.create.mockResolvedValue(null);
      await expect(
        service.signup(
          'store1',
          { name: 'Test User', email: 'test@example.com', password: 'pw' },
          'ua',
          'ip',
        ),
      ).rejects.toThrow(Error);
      expect(userRepo.findByEmail).toHaveBeenCalled();
      expect(secretService.create).toHaveBeenCalled();
      expect(roleRepo.createOwner).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalled();
      expect(userEvent.created).toHaveBeenCalled();
      expect(token.emailVerification).toHaveBeenCalled();
      expect(userEvent.emailVerificationRequested).toHaveBeenCalled();
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
      token.access.mockResolvedValue({ token: 'access' });
      token.refresh.mockResolvedValue({ token: 'refresh' });
      token.emailVerification.mockResolvedValue({
        token: 'email-verification-token',
      });

      const result = await service.signup(
        'store1',
        { name: 'Test User', email: 'test@example.com', password: 'pw' },
        'ua',
        'ip',
      );
      expect(userRepo.findByEmail).toHaveBeenCalled();
      expect(secretService.create).toHaveBeenCalled();
      expect(roleRepo.createOwner).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalled();
      expect(userEvent.created).toHaveBeenCalled();
      expect(token.emailVerification).toHaveBeenCalled();
      expect(userEvent.emailVerificationRequested).toHaveBeenCalled();
      expect(result.access.token).toBe('access');
      expect(result.refresh.token).toBe('refresh');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x', password: 'y' }, 'ua', 'ip'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if passwords do not match', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 'id' });
      secretService.compare.mockRejectedValue(new UnauthorizedException());
      await expect(
        service.login({ email: 'x', password: 'y' }, 'ua', 'ip'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should not create new session if there is an existing session on the device and return tokens', async () => {
      userRepo.findByEmail.mockResolvedValue({ id: 'id' });
      secretService.compare.mockResolvedValue(true);
      sessionRepo.findByUserIdAndDevice.mockResolvedValue({ id: 'id' });
      token.access.mockResolvedValue({ token: 'access' });
      token.refresh.mockResolvedValue({ token: 'refresh' });
      const res = await service.login(
        { email: 'x', password: 'y' },
        'ua',
        'ip',
      );
      expect(res.access.token).toBe('access');
      expect(res.refresh.token).toBe('refresh');
      expect(sessionRepo.create).not.toHaveBeenCalled();
      expect(userEvent.newDeviceLogin).not.toHaveBeenCalled();
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
      token.access.mockResolvedValue({ token: 'access' });
      token.refresh.mockResolvedValue({ token: 'refresh' });

      const res = await service.login(
        { email: 'x', password: 'y' },
        'ua',
        'ip',
      );
      expect(res.access.token).toBe('access');
      expect(res.refresh.token).toBe('refresh');
    });
  });

  describe('refreshToken', () => {
    it('should throw if session not found', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue(null);
      await expect(service.refreshToken('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session is revoked', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue({
        revokedAt: new Date(),
      });
      await expect(service.refreshToken('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session is expired', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      const yesterday = new Date().setDate(new Date().getDate() - 1);
      sessionRepo.findById.mockResolvedValue({
        expiresAt: yesterday,
      });
      await expect(service.refreshToken('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session has no hashed refresh token', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue({ hashedRefreshToken: null });
      await expect(service.refreshToken('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if refresh token is different from hashed refresh token', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      secretService.compare.mockRejectedValue(new UnauthorizedException());
      await expect(service.refreshToken('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user not found', async () => {
      token.verify.mockResolvedValue({ sub: 'sess1' });
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
      token.verify.mockResolvedValue({ sub: 'sess1' });
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
      token.access.mockResolvedValue({ token: 'newAccess' });

      const result = await service.refreshToken('token');
      expect(result.token).toBe('newAccess');
    });
  });

  describe('logout', () => {
    it('should throw if session not found', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue(null);
      await expect(service.logout('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session is revoked', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue({
        revokedAt: new Date(),
      });
      await expect(service.logout('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session is expired', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      const yesterday = new Date().setDate(new Date().getDate() - 1);
      sessionRepo.findById.mockResolvedValue({
        expiresAt: yesterday,
      });
      await expect(service.logout('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session has no hashed refresh token', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      sessionRepo.findById.mockResolvedValue({ hashedRefreshToken: null });
      await expect(service.logout('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if refresh token is different from hashed refresh token', async () => {
      token.verify.mockResolvedValue({ sub: 'sid' });
      secretService.compare.mockRejectedValue(new UnauthorizedException());
      await expect(service.logout('tok')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should revoke a session', async () => {
      token.verify.mockResolvedValue({ sub: 'sess1' });
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

    it('should throw if secret different from hashed secret', async () => {
      clientRepo.findById.mockResolvedValue({
        id: 'client1',
        hashedSecret: 'hash',
      });
      secretService.compare.mockRejectedValue(new UnauthorizedException());
      await expect(service.getClientToken('id', 'secret')).rejects.toThrow(
        new UnauthorizedException(),
      );
    });

    it('should return a client token', async () => {
      clientRepo.findById.mockResolvedValue({
        id: 'client1',
        hashedSecret: 'hash',
      });
      secretService.compare.mockResolvedValue(true);
      token.client.mockResolvedValue('client-token');

      const result = await service.getClientToken('id', 'secret');
      expect(result).toBe('client-token');
    });
  });
});
