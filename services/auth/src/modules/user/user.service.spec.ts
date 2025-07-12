import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepo } from 'src/db/repositories/user.repo';
import { TokenService } from 'src/common/services/token/token.service';
import { SecretService } from 'src/common/services/secret/secret.service';
import { UserEvent } from 'src/messaging/event/user.event';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { CacheService } from 'src/cache/cache.service';
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserData } from './user.inputs';

const mockUserRepo = () => ({
  findById: jest.fn(),
  updatePassword: jest.fn(),
  updateEmail: jest.fn(),
  updateEmailVerified: jest.fn(),
  findByEmail: jest.fn(),
  listByStore: jest.fn(),
  create: jest.fn(),
  deactivate: jest.fn(),
});

const mockTokenService = () => ({
  generateEmailVerificationToken: jest.fn(),
  verifyEmailToken: jest.fn(),
  generatePasswordResetToken: jest.fn(),
});

const mockSecretService = () => ({
  compare: jest.fn(),
  create: jest.fn(),
});

const mockUserEvent = () => ({
  updated: jest.fn(),
  emailVerificationRequested: jest.fn(),
  emailVerified: jest.fn(),
  passwordResetRequested: jest.fn(),
  created: jest.fn(),
  deactivated: jest.fn(),
});

const mockRoleRepo = () => ({
  findById: jest.fn(),
});

const mockCacheService = () => ({
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let tokenService: ReturnType<typeof mockTokenService>;
  // let secret: ReturnType<typeof mockSecretService>;
  // let event: ReturnType<typeof mockUserEvent>;
  let roleRepo: ReturnType<typeof mockRoleRepo>;
  // let cache: ReturnType<typeof mockCacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepo, useFactory: mockUserRepo },
        { provide: TokenService, useFactory: mockTokenService },
        { provide: SecretService, useFactory: mockSecretService },
        { provide: UserEvent, useFactory: mockUserEvent },
        { provide: RoleRepo, useFactory: mockRoleRepo },
        { provide: CacheService, useFactory: mockCacheService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(UserRepo);
    tokenService = module.get(TokenService);
    // secret = module.get(SecretService);
    // event = module.get(UserEvent);
    roleRepo = module.get(RoleRepo);
    // cache = module.get(CacheService);
  });

  describe('updatePassword', () => {
    it('should throw if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(
        service.updatePassword('id', { oldPassword: 'x', newPassword: 'y' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEmail', () => {
    it('should throw if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(
        service.updateEmail('id', 'test@example.com'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('requestEmailVerification', () => {
    it('should throw if user not found', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.requestEmailVerification('x@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if email already verified', async () => {
      userRepo.findByEmail.mockResolvedValue({ emailVerified: true });
      await expect(
        service.requestEmailVerification('x@example.com'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('should throw if user not found', async () => {
      tokenService.verifyEmailToken.mockResolvedValue({
        sub: 'id',
        email: 'x@example.com',
      });
      userRepo.findById.mockResolvedValue(null);
      await expect(service.verifyEmail('token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('requestPasswordResetToken', () => {
    it('should throw if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(
        service.requestPasswordResetToken('uid', 'x@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should throw if user not found', async () => {
      tokenService.verifyEmailToken.mockResolvedValue({
        sub: 'id',
        email: 'x@example.com',
      });
      userRepo.findById.mockResolvedValue(null);
      await expect(service.resetPassword('token', 'pass')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should throw if user already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({});
      await expect(
        service.create(
          'store1',
          { email: 'test@example.com' } as UserData,
          'role1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if role not in store', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.findById.mockResolvedValue({ storeId: 'wrong' });
      await expect(
        service.create('store1', { email: 'a' } as UserData, 'role1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if creation fails', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      roleRepo.findById.mockResolvedValue({ id: 'role1', storeId: 'store1' });
      userRepo.create.mockResolvedValue(null);
      await expect(
        service.create('store1', { email: 'x' } as UserData, 'role1'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('get', () => {
    it('should throw if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(service.get('uid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should throw if user not found or mismatched store', async () => {
      userRepo.findById.mockResolvedValue(null);
      await expect(service.deactivate('uid', 'store')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
