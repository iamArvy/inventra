// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export function UserById(paramKey: string) {
//   return createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
//     const rpcData = ctx.switchToRpc().getData();
//     return rpcData?.[paramKey] as string;
//   })();
// }
