import { Inject, Injectable } from '@nestjs/common';
import { UpdateAttributeInput } from '../../dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ATTRIBUTE_SERVICE_NAME,
  AttributeServiceClient,
  AttributeInput,
} from 'src/common/proto/product';
import { AppService } from 'src/app.service';
import { User } from 'src/common/types';

@Injectable()
export class AttributeService extends AppService<AttributeServiceClient> {
  constructor(@Inject('product') client: ClientGrpc) {
    super(client, ATTRIBUTE_SERVICE_NAME);
  }

  async create(
    { id, store_id }: User,
    variantId: string,
    data: AttributeInput,
  ) {
    try {
      // Check if the variant is in a product in the store using the store id
      const attribute = await this.call(
        this.service.create({ data, variantId }),
      );
      if (attribute)
        this.logger.log(
          `Attribute: ${attribute.id} created for Variant: ${variantId} in Store: ${store_id} by User: ${id}`,
        );
      return attribute;
    } catch (error) {
      this.handleError(
        error,
        `Failed to create attribute for variant: ${variantId} in Store: ${store_id} by User: ${id} — ${error}`,
      );
    }
  }

  get({ id: userId, store_id }: User, id: string) {
    try {
      return this.service.get({ id });
    } catch (error) {
      this.handleError(
        error,
        `Failed to get attribute: ${id} in Store: ${store_id} by User: ${userId} — ${error}`,
      );
    }
  }

  async update(
    { id: userId, store_id }: User,
    id: string,
    data: UpdateAttributeInput,
  ) {
    try {
      // Check if the store owns the product that own the variant before updating
      const response = await this.call(this.service.update({ id, data }));
      if (response.success)
        this.logger.log(
          `Attribute: ${id} successfully updated by user: ${userId} in store: ${store_id}`,
        );
    } catch (error) {
      this.handleError(
        error,
        `Failed to update attribute: ${id} in Store: ${store_id} by User: ${userId} — ${error}`,
      );
    }
  }

  async delete({ id: userId, store_id }: User, id: string) {
    try {
      // Check if the store owns the product that own the variant before updating
      const response = await this.call(this.service.delete({ id }));
      if (response.success)
        this.logger.log(
          `Attribute: ${id} successfully deleted by user: ${userId} in store: ${store_id}`,
        );
    } catch (error) {
      this.handleError(
        error,
        `Failed to delete attribute: ${id} in Store: ${store_id} by User: ${userId} — ${error}`,
      );
    }
  }
}
