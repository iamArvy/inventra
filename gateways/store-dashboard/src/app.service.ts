import {
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    return await firstValueFrom(obs);
  }

  protected handleError(error: any, context: string): never {
    this.logger.error(`${context} — ${error}`);

    if (error instanceof HttpException) {
      throw error;
    }

    // if (
    //   error?.message &&
    //   typeof error.message === 'object' &&
    //   'message' in error.message
    // ) {
    //   const { message, code } = error.message;
    //   throw new HttpException(message, code || 500);
    // }

    throw new InternalServerErrorException('Unexpected error occurred');
  }
}
