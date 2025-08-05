import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  store_id: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
