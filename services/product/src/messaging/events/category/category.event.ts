import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';
import { CategoryEvents } from './category.keys';
import { CategoryDto } from 'src/category/dto';

@Injectable()
export class CategoryEvent extends RabbitmqService {
  created(data: CategoryDto) {
    this.emit(CategoryEvents.CATEGORY_CREATED, data);
  }

  updated(data: CategoryDto) {
    this.emit(CategoryEvents.CATEGORY_UPDATED, data);
  }

  deactivated(id: string) {
    this.emit(CategoryEvents.CATEGORY_DELETED, { id });
  }
}
