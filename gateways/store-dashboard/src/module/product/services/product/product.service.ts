import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductInput,
  UpdateProductInput,
} from 'src/module/product/dto/product/product.inputs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'src/common/generated/product';
// import {
//   STORE_SERVICE_NAME,
//   StoreServiceClient,
// } from 'src/common/generated/store';
import { AppService } from 'src/app.service';
import { User } from 'src/common/types';

@Injectable()
export class ProductService extends AppService<ProductServiceClient> {
  constructor(
    @Inject('product') client: ClientGrpc,
    // @Inject('store') private storeClient: ClientGrpc,
  ) {
    super(client, PRODUCT_SERVICE_NAME);
  }
  // private storeService: StoreServiceClient;
  // onModuleInit() {
  //   this.storeService =
  //     this.storeClient.getService<StoreServiceClient>(STORE_SERVICE_NAME);
  // }

  async create({ id, store_id }: User, data: CreateProductInput) {
    try {
      // Send request to check if the store exist first
      // const store = await this.call(this.storeService.getByOwner({ id }));
      const product = await this.call(
        this.service.create({ storeId: store_id, ...data }),
      );
      if (product)
        this.logger.log(
          `Product: ${product.id} created for store: ${store_id} by ${id}`,
        );
      return product;
    } catch (error) {
      this.handleError(
        error,
        `Product Creation failed for store with id: ${store_id} by user with id: ${id}`,
      );
    }
  }

  get(id: string) {
    try {
      return this.service.get({ id });
    } catch (error) {
      this.handleError(error, `Error getting Product: ${id}`);
    }
  }

  async list({ store_id }: User) {
    try {
      const products = await this.call(
        this.service.listStoreProducts({ id: store_id }),
      );
      return products.products;
    } catch (error) {
      this.handleError(error, `Error getting products for store: ${store_id}`);
    }
  }

  async update(
    { id: userId, store_id }: User,
    id: string,
    data: UpdateProductInput,
  ) {
    try {
      // Check if product belongs to the store first
      const response = await this.call(this.service.update({ id, data }));
      if (response)
        this.logger.log(
          `Product: ${id} updated in store: ${store_id} by user: ${userId}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Error Updating Product: ${id} in store: ${store_id} by user: ${userId}`,
      );
    }
  }

  async delete({ id: userId, store_id }: User, id: string) {
    try {
      // Check if product belongs to the store first
      const response = await this.call(this.service.delete({ id }));
      if (response)
        this.logger.log(
          `Product: ${id} deleted from store: ${store_id} by user: ${userId}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Error deleting Product: ${id} in store: ${store_id} by user: ${userId}`,
      );
    }
  }
}
