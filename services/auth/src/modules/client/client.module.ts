import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SecretService } from 'src/common/services/secret/secret.service';

@Module({
  providers: [ClientService, SecretService],
  controllers: [ClientController],
})
export class ClientModule {}
