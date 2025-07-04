import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { DbModule } from 'src/db/db.module';
import { BaseModule } from 'src/common/base/base.module';

@Module({
  imports: [DbModule, BaseModule],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
