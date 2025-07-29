import { Injectable } from '@nestjs/common';
import { PartialStoreData, StoreData, StoreDto } from './store.dto';
import { StoreRepository } from 'db/repository';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from 'helpers/grpc-exception';
import { StoreEvent } from 'src/messaging/events/store';

@Injectable()
export class StoreService {
  constructor(
    private readonly repo: StoreRepository,
    private readonly event: StoreEvent,
  ) {}

  async create(data: StoreData) {
    const store = await this.repo.create({
      ...data,
    });

    if (!store) throw new InternalServerErrorException('Store Creation Failed');
    this.event.created(new StoreDto(store));
    return store;
  }

  async update(id: string, data: PartialStoreData) {
    const userStore = await this.repo.findById(id);
    if (!userStore) throw new NotFoundException('Store not found');
    const store = await this.repo.update(userStore.id, data);
    if (!store)
      throw new InternalServerErrorException('Store Activation Failed');
    this.event.updated(new StoreDto(store));
    return { success: true };
  }

  async activate(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'ACTIVE')
      throw new BadRequestException('Store already active');

    const activate = await this.repo.setStatus(id, 'ACTIVE');
    if (!activate)
      throw new InternalServerErrorException('Store Activation Failed');
    this.event.activated(id);
    return { success: true };
  }

  async deactivate(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    if (store.status === 'INACTIVE')
      throw new BadRequestException('Store already deactivated');
    await this.repo.setStatus(id, 'INACTIVE');
    this.event.deactivated(id);
    return { success: true };
  }

  async getStoreById(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async getAllStores() {
    const stores = await this.repo.findAll();
    return { stores };
  }

  async getPendingStores() {
    const stores = await this.repo.findByStatus('PENDING');
    return { stores };
  }

  async getActiveStores() {
    const stores = await this.repo.findByStatus('ACTIVE');
    return { stores };
  }

  async getInactiveStores() {
    const stores = await this.repo.findByStatus('INACTIVE');
    return { stores };
  }
}
