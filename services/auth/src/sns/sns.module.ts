import { Module } from '@nestjs/common';
import { SnsService } from './sns.service';

@Module({
  providers: [SnsService],
  exports: [SnsService],
})
export class SnsModule {}
// This module provides the SNS service for publishing messages to AWS SNS topics.
// It can be imported into other modules to use the SNS functionality.
