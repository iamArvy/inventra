import {
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
// import { firstValueFrom, Observable } from 'rxjs';

export abstract class BaseService {
  protected readonly logger = new Logger(this.constructor.name);
  // protected service: T;

  // constructor(
  //   protected readonly client: ClientGrpc, // token is configurable
  //   private readonly serviceName: string,
  // ) {}

  // onModuleInit() {
  //   this.service = this.client.getService<T>(this.serviceName);
  // }

  // protected async call<T>(obs: Observable<T>): Promise<T> {
  //   return await firstValueFrom(obs);
  // }

  protected handleError(error: any, context?: string): never {
    this.logger.error(`${context} — ${error}`);

    if (error instanceof HttpException) {
      throw new RpcException(error.getResponse());
    }
    if (error instanceof RpcException) {
      throw error;
    }
    throw new InternalServerErrorException('Unexpected error occurred');
  }
}
