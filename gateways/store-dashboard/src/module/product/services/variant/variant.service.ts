import { User } from 'src/common/types/index';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PartialVariantInput,
  VARIANT_SERVICE_NAME,
  VariantServiceClient,
  VariantInput,
} from 'src/common/proto/product';
import { AppService } from 'src/app.service';

@Injectable()
export class VariantService extends AppService<VariantServiceClient> {
  constructor(@Inject('product') client: ClientGrpc) {
    super(client, VARIANT_SERVICE_NAME);
  }

  async create({ id, store_id }: User, productId: string, data: VariantInput) {
    try {
      // Check if the product belongs to the store first
      const variant = await this.call(this.service.create({ productId, data }));
      if (variant)
        this.logger.log(
          `Variant created for product: ${productId} in store ${store_id} by user: ${id}`,
        );
      return variant;
    } catch (error) {
      this.handleError(
        error,
        `Error creating variant for product: ${productId}`,
      );
    }
  }

  // productVariants(id: string) {
  //   return this.service.list({});
  // }

  get(id: string) {
    try {
      return this.service.get({ id });
    } catch (error) {
      this.handleError(error, `Error getting variant: ${id}`);
    }
  }

  async update(
    { id: userId, store_id }: User,
    id: string,
    data: PartialVariantInput,
  ) {
    try {
      const response = await this.call(this.service.update({ id, data }));
      if (response)
        this.logger.log(
          `Variant: ${id} updated in store: ${store_id} by user: ${userId}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Error updating variant: ${id} for store: ${store_id} by user: ${userId}`,
      );
    }
  }

  async delete({ id: userId, store_id }: User, id: string) {
    try {
      const response = await this.call(this.service.delete({ id }));
      if (response)
        this.logger.log(
          `Variant: ${id} deleted in store: ${store_id} by user: ${userId}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Error deleting variant: ${id} from store: ${store_id} by user: ${userId}`,
      );
    }
    return;
  }
}
