import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

class GrpcException extends RpcException {
  constructor(message: string, code: status) {
    super({ message, code });
  }
}

export class NotFoundException extends GrpcException {
  constructor(message = 'Not Found') {
    super(message, status.NOT_FOUND);
  }
}

export class UnauthorizedException extends GrpcException {
  constructor(message = 'Unauthorized') {
    super(message, status.UNAUTHENTICATED);
  }
}

export class BadRequestException extends GrpcException {
  constructor(message = 'Bad Request') {
    super(message, status.INVALID_ARGUMENT);
  }
}

export class InternalServerErrorException extends GrpcException {
  constructor(message = 'Internal Server Error') {
    super(message, status.INTERNAL);
  }
}

export class ConflictException extends GrpcException {
  constructor(message = 'Resource Already Exists') {
    super(message, status.ALREADY_EXISTS);
  }
}
