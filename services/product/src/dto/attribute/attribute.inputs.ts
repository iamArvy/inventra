import { PartialType } from '@nestjs/mapped-types';
import { CreateInput, IdInput, ListInput, UpdateInput } from '../app.inputs';

export class AttributeInput {
  key: string;
  value: string;
}

export class CreateAttributeInput extends CreateInput<AttributeInput> {
  variant_id: string;
}

export class PartialAttributeInput extends PartialType(AttributeInput) {}

export class UpdateAttributeInput extends UpdateInput<PartialAttributeInput> {}

class OrderInput {
  key?: 'asc' | 'desc';
  value?: 'asc' | 'desc';
}
export class ListAttributeInput extends ListInput<OrderInput> {}
export class ListAttributeByRelationInput extends IdInput {
  params: ListAttributeInput;
}
