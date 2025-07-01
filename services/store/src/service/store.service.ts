import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartialStoreData, StoreData } from '../dto';
import { RpcException } from '@nestjs/microservices';
import { StoreRepository } from '../db/repository/store.repository';

@Injectable()
export class StoreService {
  constructor(private readonly repo: StoreRepository) {}

  async createStore(owner_id: string, data: StoreData) {
    const ownerStore = await this.repo.findByOwnerId(owner_id);
    if (ownerStore) throw new RpcException('User already own store');
    const store = this.repo.create({
      owner_id,
      ...data,
    });

    return store;
    // emit the store creation so admin can activate
  }

  async updateStore(owner_id: string, data: PartialStoreData) {
    // try {
    const userStore = await this.repo.findByOwnerId(owner_id);
    if (!userStore) throw new RpcException('Store not found for user');
    const store = this.repo.update(userStore.id, data);
    return store;
    // } catch (error) {
    //   throw new RpcException(error as string);
    // }
  }

  async activateStore(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'ACTIVE')
      throw new BadRequestException('Store already active');

    await this.repo.setStatus(id, 'ACTIVE');
    // emit store activation so it can be used and user role can be updated
    return true;
  }

  async deactivateStore(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'INACTIVE')
      throw new BadRequestException('Store already deactivated');
    await this.repo.setStatus(id, 'INACTIVE');
    return true;
  }

  getStoreById(id: string) {
    const store = this.repo.findById(id);
    return store;
  }

  getStoreByOwnerId(owner_id: string) {
    const store = this.repo.findByOwnerId(owner_id);
    return store;
  }

  getAllStores() {
    const stores = this.repo.findAll();
    return stores;
  }

  async getPendingStores() {
    return await this.repo.findByStatus('PENDING');
  }

  async getActiveStores() {
    return await this.repo.findByStatus('ACTIVE');
  }

  async getInactiveStores() {
    return await this.repo.findByStatus('INACTIVE');
  }
}
