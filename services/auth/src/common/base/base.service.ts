import {
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
// import { firstValueFrom, Observable } from 'rxjs';
import { CacheService } from 'src/common/cache/cache.service';

export abstract class BaseService {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly cache = CacheService.instance;

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
