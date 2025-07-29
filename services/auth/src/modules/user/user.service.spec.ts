import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TokenService } from 'common/services/token/token.service';
import { SecretService } from 'common/services/secret/secret.service';
import { UserEvent } from 'events/user';
import { RoleRepo, UserRepo } from 'db/repository';
import {
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserData } from './user.inputs';

const mockUserRepo = () => ({
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  updatePassword: jest.fn(),
  update: jest.fn(),
  updateEmail: jest.fn(),
  updateEmailVerified: jest.fn(),
  findByEmail: jest.fn(),
  listByStore: jest.fn(),
  create: jest.fn(),
  deactivate: jest.fn(),
});

const mockTokenService = () => ({
  emailVerification: jest.fn(),
  verify: jest.fn(),
  passwordReset: jest.fn(),
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

describe('UserService', () => {
  let service: UserService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let token: ReturnType<typeof mockTokenService>;
  let roleRepo: ReturnType<typeof mockRoleRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepo, useFactory: mockUserRepo },
        { provide: TokenService, useFactory: mockTokenService },
        { provide: SecretService, useFactory: mockSecretService },
        { provide: UserEvent, useFactory: mockUserEvent },
        { provide: RoleRepo, useFactory: mockRoleRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(UserRepo);
    token = module.get(TokenService);
    roleRepo = module.get(RoleRepo);
  });

  describe('update', () => {
    it('should throw if user not found', async () => {
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      // userRepo.update.mockResolvedValue({ name: 'name' });
      await expect(service.update('id', { name: 'new_name' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePassword', () => {
    it('should throw if user not found', async () => {
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      await expect(
        service.updatePassword('id', { oldPassword: 'x', newPassword: 'y' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEmail', () => {
    it('should throw if user not found', async () => {
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      await expect(
        service.updateEmail('id', 'test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('requestEmailVerification', () => {
    it('should throw if user not found', async () => {
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      await expect(
        service.requestEmailVerification('x@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if email already verified', async () => {
      userRepo.findByIdOrThrow.mockResolvedValue({ emailVerified: true });
      await expect(
        service.requestEmailVerification('x@example.com'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('should throw if user not found', async () => {
      token.verify.mockResolvedValue({
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
      userRepo.findByEmail.mockResolvedValue(null);
      await expect(
        service.requestPasswordResetToken('x@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should throw if user not found', async () => {
      token.verify.mockResolvedValue({
        sub: 'id',
        email: 'x@example.com',
      });
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
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
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      await expect(service.get('uid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('should throw if user not found or mismatched store', async () => {
      userRepo.findByIdOrThrow.mockRejectedValue(new NotFoundException());
      await expect(service.deactivate('uid', 'store')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
