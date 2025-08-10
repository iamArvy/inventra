import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '../category/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: String, required: true })
  sku: string;

  @Prop({ type: String, required: true })
  store_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: Object, default: {} })
  attributes: Record<string, any>;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ sku: 1, store_id: 1 }, { unique: true });
ProductSchema.index({ deletedAt: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ store_id: 1 });
ProductSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 }, name: 'ProductTextIndex' },
);
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });
