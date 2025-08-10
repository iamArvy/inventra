import { Expose, plainToInstance, Transform } from 'class-transformer';
import { CategoryDocument } from 'src/category/category.schema';
export class CategoryDto {
  @Expose()
  @Transform(({ obj }: { obj: CategoryDocument }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  image?: string;

  @Expose()
  @Transform(({ obj }: { obj: CategoryDocument }) => obj.store_id.toString())
  store_id: string;

  @Expose()
  created_at: Date;

  static from(data: CategoryDocument): CategoryDto {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }

  static fromMany(data: CategoryDocument[]): CategoryDto[] {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }
}

// export class CreateCategoryDto {
//   name: string;
//   description?: string;
//   image?: string;
// }

export class UpdateCategoryDto {
  name?: string;
  description?: string;
  image?: string;
}
