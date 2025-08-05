export class IdInput {
  id: string;
}

export class UpdateInput<T> extends IdInput {
  data: T;
}

export class CreateInput<T> {
  data: T;
}

export class ListInput<O = object> {
  orderBy?: O;
  skip?: number;
  take?: number;
}
