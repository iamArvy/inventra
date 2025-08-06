import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

function mapHttpStatusToGrpcCode(httpStatus: number): status {
  switch (httpStatus as HttpStatus) {
    case HttpStatus.BAD_REQUEST:
      return status.INVALID_ARGUMENT;
    case HttpStatus.UNAUTHORIZED:
      return status.UNAUTHENTICATED;
    case HttpStatus.FORBIDDEN:
      return status.PERMISSION_DENIED;
    case HttpStatus.NOT_FOUND:
      return status.NOT_FOUND;
    case HttpStatus.CONFLICT:
      return status.ALREADY_EXISTS;
    case HttpStatus.TOO_MANY_REQUESTS:
      return status.RESOURCE_EXHAUSTED;
    case HttpStatus.NOT_IMPLEMENTED:
      return status.UNIMPLEMENTED;
    case HttpStatus.BAD_GATEWAY:
      return status.UNAVAILABLE;
    case HttpStatus.GATEWAY_TIMEOUT:
      return status.DEADLINE_EXCEEDED;
    default:
      return status.UNKNOWN;
  }
}

export async function runRpcMethod<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    if (error instanceof RpcException) {
      throw error;
    }
    if (error instanceof HttpException) {
      const grpcCode = mapHttpStatusToGrpcCode(error.getStatus());
      throw new RpcException({ code: grpcCode, details: error.message });
    }
    throw new RpcException({
      code: status.UNKNOWN,
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
