import { status } from '@grpc/grpc-js';
import {
  Logger,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export abstract class BaseClient<T extends object> implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);
  protected service: T;
  public proxy: T;

  constructor(
    protected readonly client: ClientGrpc, // token is configurable
    private readonly serviceName: string,
  ) {}

  onModuleInit() {
    const rawService = this.client.getService<T>(this.serviceName);
    this.service = rawService;

    this.proxy = new Proxy(rawService, {
      get: (target, propKey) => {
        const original = target[propKey as keyof T];
        if (typeof original !== 'function') {
          return original;
        }
        return (...args: any[]) => this.call(original.apply(target, args));
      },
    });
  }

  protected async call<T>(obs: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(obs);
    } catch (error: unknown) {
      // @ts-expect-error issues wil error value
      const { details, code } = error;
      console.error('GRPC Error:', error);
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
}
