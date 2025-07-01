import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class AttributeInput {
  @Field(() => String)
  key: string;

  @Field(() => String)
  value: string;
}

@InputType()
export class UpdateAttributeInput extends PartialType(AttributeInput) {}
