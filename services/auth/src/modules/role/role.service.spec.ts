import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepo } from 'src/db/repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockRoleRepo = () => ({
  findRoleByNameAndStore: jest.fn(),
  create: jest.fn(),
  addPermissionsToRole: jest.fn(),
  listByStore: jest.fn(),
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  removePermissionsFromRole: jest.fn(),
});

describe('RoleService', () => {
  let service: RoleService;
  let repo: ReturnType<typeof mockRoleRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, { provide: RoleRepo, useFactory: mockRoleRepo }],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repo = module.get(RoleRepo);
  });

  describe('create', () => {
    it('should throw if role exists', async () => {
      repo.findRoleByNameAndStore.mockResolvedValue({});
      await expect(
        service.create('store1', { name: 'admin' }, []),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and return role with permissions', async () => {
      repo.findRoleByNameAndStore.mockResolvedValue(null);
      repo.create.mockResolvedValue({ id: 'role1' });
      repo.addPermissionsToRole.mockResolvedValue({ id: 'role1' });

      const result = await service.create('store1', { name: 'admin' }, [
        'perm',
      ]);
      expect(result.id).toBe('role1');
    });
  });

  describe('listByStore', () => {
    it('should return roles', async () => {
      repo.listByStore.mockResolvedValue([{ id: 'role1' }]);
      const result = await service.listByStore('store1');
      expect(result.roles.length).toBeGreaterThan(0);
    });
  });

  describe('get', () => {
    it('should return a role', async () => {
      repo.findById.mockResolvedValue({ id: 'role1' });
      const result = await service.get('role1');
      expect(result.id).toBe('role1');
    });

    it('should throw if role not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.get('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw if role not in store', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'role1', storeId: 'wrong' });
      await expect(
        service.update('role1', 'store1', { name: 'new' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if new name exists in store', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'role1',
        storeId: 'store1',
      });
      repo.findRoleByNameAndStore.mockResolvedValue({});
      await expect(
        service.update('role1', 'store1', { name: 'admin' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update and clear cache', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'role1',
        storeId: 'store1',
      });
      repo.findRoleByNameAndStore.mockResolvedValue(null);
      repo.update.mockResolvedValue({});
      const result = await service.update('role1', 'store1', { name: 'new' });
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete and clear cache', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'role1',
        storeId: 'store1',
      });
      repo.delete.mockResolvedValue(true);
      const result = await service.delete('role1');
      expect(result.success).toBe(true);
    });
  });

  describe('attachPermissions', () => {
    it('should throw if role is not in store', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'role1', storeId: 'other' });
      await expect(
        service.attachPermissions('role1', ['perm1'], 'store1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should attach permissions and clear cache', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'role1',
        storeId: 'store1',
      });
      repo.addPermissionsToRole.mockResolvedValue({ id: 'role1' });
      const result = await service.attachPermissions(
        'role1',
        ['perm1'],
        'store1',
      );
      expect(result.success).toBe(true);
    });
  });

  describe('detachPermissions', () => {
    it('should throw if role is not in store', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'role1', storeId: 'other' });
      await expect(
        service.detachPermissions('role1', ['perm1'], 'store1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should detach permissions and clear cache', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'role1',
        storeId: 'store1',
      });
      repo.removePermissionsFromRole.mockResolvedValue({ id: 'role1' });
      const result = await service.detachPermissions(
        'role1',
        ['perm1'],
        'store1',
      );
      expect(result.success).toBe(true);
    });
  });
});
