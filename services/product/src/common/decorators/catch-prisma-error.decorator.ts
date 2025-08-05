import { handlePrismaError } from '../helpers/handle-prisma-error';

export function CatchPrismaError(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        handlePrismaError(error);
      }
    };
  };
}
