import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
// import { SuperuserSeeder } from './superuser.seeder';
import { PermissionSeeder } from './permission.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  // const seeder = app.get(SuperuserSeeder);
  const type = process.argv[2];
  if (type === 'permissions') {
    const seeder = app.get(PermissionSeeder);
    await seeder.seedPermissions();
  }
  // await seeder.seedSuperuser();
  await app.close();
}
bootstrap();
