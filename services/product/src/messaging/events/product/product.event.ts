import { Injectable } from '@nestjs/common';
import { RabbitmqService } from 'src/messaging/rabbitmq.service';
import { ProductEvents } from './product.keys';
import { ProductDto } from 'src/product/dto';

@Injectable()
export class ProductEvent extends RabbitmqService {
  created(data: ProductDto) {
    this.emit(ProductEvents.PRODUCT_CREATED, data);
  }

  updated(data: ProductDto) {
    this.emit(ProductEvents.PRODUCT_UPDATED, data);
  }

  deactivated(id: string) {
    this.emit(ProductEvents.PRODUCT_DELETED, { id });
  }
}
