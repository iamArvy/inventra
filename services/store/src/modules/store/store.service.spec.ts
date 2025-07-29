import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { StoreRepository } from 'db/repository';
import { StoreEvent } from 'src/messaging/events/store';
import { StoreData, PartialStoreData } from './store.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from 'helpers/grpc-exception';

const mockStore = {
  id: 'store-1',
  name: 'Test Store',
  status: 'PENDING',
  description: 'Store description',
  email: 'storeemail',
  phone: 'storephone',
  logo_url: undefined,
  location: undefined,
  website: undefined,
  updated_at: undefined,
  created_at: new Date(),
};

const mockEvent = () => ({
  created: jest.fn(),
  updated: jest.fn(),
  activated: jest.fn(),
  deactivated: jest.fn(),
});

const mockRepo = () => ({
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByStatus: jest.fn(),
  setStatus: jest.fn(),
});

describe('StoreService', () => {
  let service: StoreService;
  let repo: ReturnType<typeof mockRepo>;
  let event: ReturnType<typeof mockEvent>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: StoreRepository,
          useFactory: mockRepo,
        },
        {
          provide: StoreEvent,
          useFactory: mockEvent,
        },
      ],
    }).compile();

    service = module.get(StoreService);
    repo = module.get(StoreRepository);
    event = module.get(StoreEvent);
  });

  describe('create()', () => {
    it('should create a store and emit event', async () => {
      repo.create.mockResolvedValue(mockStore);

      const result = await service.create(mockStore);

      expect(repo.create).toHaveBeenCalledWith(mockStore);
      expect(event.created).toHaveBeenCalled();
      expect(result).toEqual(mockStore);
    });

    it('should throw InternalServerErrorException if creation fails', async () => {
      repo.create.mockResolvedValue(null);

      await expect(service.create(mockStore as StoreData)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update()', () => {
    it('should update a store and emit event', async () => {
      repo.findById.mockResolvedValue(mockStore);
      repo.update.mockResolvedValue({ ...mockStore, name: 'Updated Store' });

      const result = await service.update('store-1', {
        name: 'Updated Store',
      } as PartialStoreData);

      expect(repo.findById).toHaveBeenCalledWith('store-1');
      expect(repo.update).toHaveBeenCalledWith('store-1', {
        name: 'Updated Store',
      });
      expect(event.updated).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if store does not exist', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.update('bad-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      repo.findById.mockResolvedValue(mockStore);
      repo.update.mockResolvedValue(null);

      await expect(service.update('store-1', {})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('activate()', () => {
    it('should activate a store and emit event', async () => {
      repo.findById.mockResolvedValue({ ...mockStore, status: 'PENDING' });
      repo.setStatus.mockResolvedValue(true);

      const result = await service.activate('store-1');

      expect(repo.setStatus).toHaveBeenCalledWith('store-1', 'ACTIVE');
      expect(event.activated).toHaveBeenCalledWith('store-1');
      expect(result.success).toBe(true);
    });

    it('should throw if already active', async () => {
      repo.findById.mockResolvedValue({ ...mockStore, status: 'ACTIVE' });

      await expect(service.activate('store-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.activate('store-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if setStatus fails', async () => {
      repo.findById.mockResolvedValue({ ...mockStore, status: 'PENDING' });
      repo.setStatus.mockResolvedValue(false);

      await expect(service.activate('store-1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deactivate()', () => {
    it('should deactivate a store and emit event', async () => {
      repo.findById.mockResolvedValue({ ...mockStore, status: 'ACTIVE' });

      const result = await service.deactivate('store-1');

      expect(repo.setStatus).toHaveBeenCalledWith('store-1', 'INACTIVE');
      expect(event.deactivated).toHaveBeenCalledWith('store-1');
      expect(result.success).toBe(true);
    });

    it('should throw if already inactive', async () => {
      repo.findById.mockResolvedValue({ ...mockStore, status: 'INACTIVE' });

      await expect(service.deactivate('store-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.deactivate('store-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStoreById()', () => {
    it('should return a store if found', async () => {
      repo.findById.mockResolvedValue(mockStore);

      const result = await service.getStoreById('store-1');
      expect(result).toEqual(mockStore);
    });

    it('should throw if not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.getStoreById('store-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllStores()', () => {
    it('should return all stores', async () => {
      repo.findAll.mockResolvedValue([mockStore]);

      const result = await service.getAllStores();
      expect(result.stores).toEqual([mockStore]);
    });
  });

  describe('getPendingStores()', () => {
    it('should return only pending stores', async () => {
      repo.findByStatus.mockResolvedValue([mockStore]);

      const result = await service.getPendingStores();
      expect(repo.findByStatus).toHaveBeenCalledWith('PENDING');
      expect(result.stores).toEqual([mockStore]);
    });
  });

  describe('getActiveStores()', () => {
    it('should return only active stores', async () => {
      repo.findByStatus.mockResolvedValue([mockStore]);

      const result = await service.getActiveStores();
      expect(repo.findByStatus).toHaveBeenCalledWith('ACTIVE');
      expect(result.stores).toEqual([mockStore]);
    });
  });

  describe('getInactiveStores()', () => {
    it('should return only inactive stores', async () => {
      repo.findByStatus.mockResolvedValue([mockStore]);

      const result = await service.getInactiveStores();
      expect(repo.findByStatus).toHaveBeenCalledWith('INACTIVE');
      expect(result.stores).toEqual([mockStore]);
    });
  });
});
