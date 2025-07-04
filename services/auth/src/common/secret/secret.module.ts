import { Module } from '@nestjs/common';
import { SecretService } from './secret.service';

@Module({
  providers: [SecretService],
  exports: [SecretService],
  // Note: No controllers are defined in this module, as it is likely a utility module
  // that provides services for other modules rather than handling HTTP requests directly.
})
export class SecretModule {}
