import { createParamDecorator, ExecutionContext } from '@nestjs/common';
type RpcPayload = {
  [key: string]: string | number | boolean | undefined;
};

export const GetById = createParamDecorator<string>(
  (paramKey: string, ctx: ExecutionContext): string => {
    const data: RpcPayload = ctx.switchToRpc().getData();
    const value = data?.[paramKey];

    if (typeof value !== 'string') {
      throw new Error(`Expected param "${paramKey}" to be a string`);
    }

    return value;
  },
);
