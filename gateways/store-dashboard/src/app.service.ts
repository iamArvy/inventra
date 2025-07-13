import { status } from '@grpc/grpc-js';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export abstract class AppService<T extends object> {
  protected readonly logger = new Logger(this.constructor.name);
  protected service: T;

  constructor(
    protected readonly client: ClientGrpc, // token is configurable
    private readonly serviceName: string,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<T>(this.serviceName);
  }

  protected async call<T>(obs: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(obs);
    } catch (error: unknown) {
      // @ts-expect-error issues wil error value
      const { details, code } = error;
      throw new HttpException(details, this.mapGrpcCode(code));
    }
  }

  private mapGrpcCode(code: status): HttpStatus {
    switch (code) {
      case status.INVALID_ARGUMENT:
        return HttpStatus.BAD_REQUEST;
      case status.UNAUTHENTICATED:
        return HttpStatus.UNAUTHORIZED;
      case status.PERMISSION_DENIED:
        return HttpStatus.FORBIDDEN;
      case status.NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case status.ALREADY_EXISTS:
        return HttpStatus.CONFLICT; // Conflict
      case status.RESOURCE_EXHAUSTED:
        return HttpStatus.TOO_MANY_REQUESTS; // Too Many Requests
      case status.UNIMPLEMENTED:
        return HttpStatus.NOT_IMPLEMENTED; // Not Implemented
      case status.UNAVAILABLE:
        return HttpStatus.BAD_GATEWAY; // Service Unavailable
      case status.DEADLINE_EXCEEDED:
        return HttpStatus.GATEWAY_TIMEOUT; // Gateway Timeout
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR; // Internal Server Error
    }
  }

  // protected handleError(error: any, context: string): never {
  //   this.logger.error(error);
  //   if (error instanceof HttpException) {
  //     throw error;
  //   }

  //   if (typeof error === 'object' && typeof error.code === 'number') {
  //     const { message, code } = error;
  //     throw new HttpException(message, this.mapGrpcCode(code));
  //   }

  //   throw new InternalServerErrorException('Unexpected error occurred');
  // }
}
