// src/common/filters/grpc-exception.filter.ts

import {
  // ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
// import { RpcArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name);
  catch(exception: any) {
    // const ctx: RpcArgumentsHost = host.switchToRpc();

    // const data = ctx.getData<unknown>();
    // const call = ctx.getContext<ServerUnaryCall<any, any>>();

    // Log method and payload (if available)
    // const method = (call as any).call?.method || 'unknown method';
    if (exception instanceof Error) {
      this.logger.error(`Exception: ${exception.message}`, exception.stack);
    } else {
      this.logger.error(`Exception: Unknown error`, JSON.stringify(exception));
    }
    // this.logger.debug('Payload:', JSON.stringify(data, null, 2));
    // If already an RpcException, pass through
    if (exception instanceof RpcException) {
      throw exception;
    }

    // Handle known HttpExceptions
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const message = exception.message;

      throw new RpcException({
        code: this.mapHttpToGrpcCode(statusCode),
        message,
      });
    }

    // Handle unexpected exceptions
    throw new RpcException({
      code: status.INTERNAL,
      message:
        exception && exception instanceof Error ? exception.message : 'unknown',
    });
  }

  private mapHttpToGrpcCode(httpStatusCode: number): status {
    switch (httpStatusCode) {
      case 400:
        return status.INVALID_ARGUMENT;
      case 401:
        return status.UNAUTHENTICATED;
      case 403:
        return status.PERMISSION_DENIED;
      case 404:
        return status.NOT_FOUND;
      case 409:
        return status.ALREADY_EXISTS;
      case 429:
        return status.RESOURCE_EXHAUSTED;
      case 501:
        return status.UNIMPLEMENTED;
      default:
        return status.INTERNAL;
    }
  }
}
