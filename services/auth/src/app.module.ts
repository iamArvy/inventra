import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperuserSeeder } from './seeder/superuser.seeder';
import { SnsModule } from './sns/sns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RoleModule,
    PrismaModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    SnsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SuperuserSeeder],
})
export class AppModule {}
