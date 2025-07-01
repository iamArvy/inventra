import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether the operation was successful',
  })
  success: boolean;
}

export class HealthResponse {
  @ApiProperty({
    type: String,
    description: 'Current status of the service',
  })
  status: string;

  @ApiProperty({
    type: String,
    description: 'Timestamp of the health check',
  })
  timestamp: string;
}
export class ErrorResponse {
  @ApiProperty({
    type: String,
    description: 'Error message describing the issue',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'HTTP status code of the error',
  })
  statusCode: string;

  @ApiProperty({
    type: String,
    description: 'Timestamp when the error occurred',
  })
  timestamp: string;
}
export class NotFoundResponse {
  @ApiProperty({
    type: String,
    description: 'Error message indicating the resource was not found',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'HTTP status code for not found',
  })
  statusCode: string;

  @ApiProperty({
    type: String,
    description: 'Timestamp when the not found error occurred',
  })
  timestamp: string;
}
export class UnauthorizedResponse {
  @ApiProperty({
    type: String,
    description: 'Error message indicating unauthorized access',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'HTTP status code for unauthorized access',
  })
  statusCode: string;

  @ApiProperty({
    type: String,
    description: 'Timestamp when the unauthorized error occurred',
  })
  timestamp: string;
}
