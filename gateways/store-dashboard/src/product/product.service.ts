import { Injectable } from '@nestjs/common';
import { ProductGrpcClient } from 'grpc-clients/product';
// import {} from // CreateProductInput,
// // UpdateProductInput,
// './dto/product/product.inputs';
// import { User } from 'src/common/types';

@Injectable()
export class ProductService {
  constructor(private readonly client: ProductGrpcClient) {} // @Inject('store') private storeClient: ClientGrpc,
  // private storeService: StoreServiceClient;
  // onModuleInit() {
  //   this.storeService =
  //     this.storeClient.getService<StoreServiceClient>(STORE_SERVICE_NAME);
  // }

  // async create({ id, store_id }: User, data: CreateProductInput) {
  //   // Send request to check if the store exist first
  //   // const store = await this.call(this.storeService.getByOwner({ id }));
  //   const product = await this.call(
  //     this.service.create({ storeId: store_id, ...data }),
  //   );
  //   if (product)
  //     this.logger.log(
  //       `Product: ${product.id} created for store: ${store_id} by ${id}`,
  //     );
  //   return product;
  // }

  get(id: string) {
    return this.client.proxy.get({ id });
  }

  // async list({ store_id }: User) {
  //   const products = this.client.proxy.list({ storeId: store_id });
  //   return products.products;
  // }

  // async update(
  //   { id: userId, store_id }: User,
  //   id: string,
  //   data: UpdateProductInput,
  // ) {
  //   // Check if product belongs to the store first
  //   const response = await this.call(this.service.update({ id, data }));
  //   if (response)
  //     this.logger.log(
  //       `Product: ${id} updated in store: ${store_id} by user: ${userId}`,
  //     );
  //   return response;
  // }

  // async delete({ id: userId, store_id }: User, id: string) {
  //   // Check if product belongs to the store first
  //   const response = await this.call(this.service.delete({ id }));
  //   if (response)
  //     this.logger.log(
  //       `Product: ${id} deleted from store: ${store_id} by user: ${userId}`,
  //     );
  //   return response;
  // }
}
