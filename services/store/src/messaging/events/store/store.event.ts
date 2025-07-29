import { Injectable } from '@nestjs/common';
import { StoreEvents } from './store.keys';
import { StoreDto } from 'src/modules/store/store.dto';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';

@Injectable()
export class StoreEvent {
  constructor(private readonly rmq: RabbitmqService) {}
  created(data: StoreDto) {
    this.rmq.emit(StoreEvents.STORE_CREATED, data);
  }

  updated(data: StoreDto) {
    this.rmq.emit(StoreEvents.STORE_UPDATED, data);
  }

  activated(id: string) {
    this.rmq.emit(StoreEvents.STORE_ACTIVATED, { id });
  }

  deactivated(id: string) {
    this.rmq.emit(StoreEvents.STORE_DEACTIVATED, { id });
  }
}
