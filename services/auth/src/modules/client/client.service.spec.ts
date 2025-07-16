import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { ClientRepo } from 'src/db/repository/repositories/client.repo';
import { SecretService } from 'src/common/services/secret/secret.service';
import { BadRequestException } from 'src/common/helpers/grpc-exception';

const mockClientRepo = () => ({
  create: jest.fn(),
  findByIdOrThrow: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  attachPermissions: jest.fn(),
  detachPermissions: jest.fn(),
  delete: jest.fn(),
});

const mockSecretService = () => ({
  create: jest.fn(),
});

describe('ClientService', () => {
  let service: ClientService;
  let repo: ReturnType<typeof mockClientRepo>;
  let secret: ReturnType<typeof mockSecretService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: ClientRepo, useFactory: mockClientRepo },
        { provide: SecretService, useFactory: mockSecretService },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repo = module.get(ClientRepo);
    secret = module.get(SecretService);
  });

  describe('create', () => {
    it('should not attach permissions if no permissions', async () => {
      secret.create.mockResolvedValue('hashed');
      repo.create.mockResolvedValue({ id: 'client1' });

      const result = await service.create('store1', { name: 'Test' }, []);
      expect(result.id).toBe('client1');
      expect(repo.attachPermissions).not.toHaveBeenCalled();
    });

    it('should create a client and attach permissions', async () => {
      secret.create.mockResolvedValue('hashed');
      repo.create.mockResolvedValue({ id: 'client1' });

      const result = await service.create('store1', { name: 'Test' }, ['read']);
      expect(result.id).toBe('client1');
      expect(repo.attachPermissions).toHaveBeenCalledWith('client1', ['read']);
    });
  });

  describe('update', () => {
    it('should throw error if storeId does not match', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'client1',
        storeId: 'store2',
      });
      await expect(
        service.update('client1', 'store1', {
          name: 'Updated',
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Client does not belong to the specified store',
        ),
      );
    });

    it('should update a client', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'client1',
        storeId: 'store1',
      });
      repo.update.mockResolvedValue(true);
      const result = await service.update('client1', 'store1', {
        name: 'Updated',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('refreshSecret', () => {
    it('should refresh the client secret', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'client1' });
      secret.create.mockResolvedValue('hashed');
      repo.update.mockResolvedValue(true);
      const result = await service.refreshSecret('client1');
      expect(result.secret).toBeDefined();
    });
  });

  describe('list', () => {
    it('should return client list', async () => {
      repo.list.mockResolvedValue([{ id: 'client1' }]);
      const result = await service.list('store1');
      expect(result.clients.length).toBeGreaterThan(0);
    });
  });

  describe('get', () => {
    it('should return a client', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'client1' });
      const result = await service.get('client1');
      expect(result.id).toBe('client1');
    });
  });

  describe('attachPermissions', () => {
    it('should attach permissions to a client', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'client1' });
      repo.attachPermissions.mockResolvedValue(true);
      const result = await service.attachPermissions('client1', ['read']);
      expect(result.success).toBe(true);
    });
  });

  describe('detachPermissions', () => {
    it('should detach permissions from a client', async () => {
      repo.findByIdOrThrow.mockResolvedValue({ id: 'client1' });
      repo.detachPermissions.mockResolvedValue(true);
      const result = await service.detachPermissions('client1', ['read']);
      expect(result.success).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete a client and clear cache', async () => {
      repo.findByIdOrThrow.mockResolvedValue({
        id: 'client1',
        storeId: 'store1',
      });
      repo.delete.mockResolvedValue(true);
      const result = await service.delete('client1');
      expect(result.success).toBe(true);
    });
  });
});
