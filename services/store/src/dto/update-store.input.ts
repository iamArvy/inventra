import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreInput } from './create-store.input';
export class UpdateStoreInput extends PartialType(CreateStoreInput) {
  id: string;
}
