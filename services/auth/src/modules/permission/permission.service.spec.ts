import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PermissionRepo } from 'src/db/repositories/permission.repo';
import { CacheService } from 'src/cache/cache.service';

const mockPermissionRepo = () => ({
  create: jest.fn(),
  list: jest.fn(),
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  listByRole: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockCacheService = () => ({
  set: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
});

describe('PermissionService', () => {
  let service: PermissionService;
  let repo: ReturnType<typeof mockPermissionRepo>;
  let cache: ReturnType<typeof mockCacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: PermissionRepo, useFactory: mockPermissionRepo },
        { provide: CacheService, useFactory: mockCacheService },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    repo = module.get(PermissionRepo);
    cache = module.get(CacheService);
  });

  describe('create', () => {
    it('should create and cache permission', async () => {
      repo.create.mockResolvedValue({ id: 'perm1' });
      const result = await service.create({ name: 'perm' });
      expect(result.id).toBe('perm1');
      expect(cache.delete).toHaveBeenCalled();
      expect(cache.set).toHaveBeenCalled();
    });

    it('should throw if creation fails', async () => {
      repo.create.mockResolvedValue(null);
      await expect(service.create({ name: 'perm' })).rejects.toThrow(
        'Failed to create permission',
      );
    });
  });

  describe('list', () => {
    it('should return permission list', async () => {
      repo.list.mockResolvedValue([{ id: 'perm1' }]);
      const result = await service.list();
      expect(result.permissions.length).toBeGreaterThan(0);
      expect(cache.set).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a permission', async () => {
      repo.findById.mockResolvedValue({ id: 'perm1' });
      const result = await service.findById('perm1');
      expect(result.id).toBe('perm1');
    });

    it('should throw if not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findById('x')).rejects.toThrow(
        'Permission not found',
      );
    });
  });

  describe('listRolePermissions', () => {
    it('should return permissions for role', async () => {
      repo.listByRole.mockResolvedValue([{ id: 'perm1' }]);
      const result = await service.listRolePermissions('role1');
      expect(result.permissions.length).toBeGreaterThan(0);
    });

    it('should throw if none found', async () => {
      repo.listByRole.mockResolvedValue([]);
      await expect(service.listRolePermissions('role1')).rejects.toThrow(
        'No permissions found for this role',
      );
    });
  });

  describe('update', () => {
    it('should update and recache permission', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'perm1' });
      repo.update.mockResolvedValue({ id: 'perm1', name: 'updated' });
      const result = await service.update('perm1', { name: 'updated' });
      expect(result.success).toBe(true);
      expect(cache.set).toHaveBeenCalled();
    });

    it('should throw if update fails', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'perm1' });
      repo.update.mockResolvedValue(null);
      await expect(service.update('perm1', { name: 'fail' })).rejects.toThrow(
        'Failed to update permission',
      );
    });
  });

  describe('delete', () => {
    it('should delete and clear caches', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'perm1' });
      repo.delete.mockResolvedValue(true);
      const result = await service.delete('perm1');
      expect(result.success).toBe(true);
      expect(cache.delete).toHaveBeenCalledTimes(2);
    });
  });
});
