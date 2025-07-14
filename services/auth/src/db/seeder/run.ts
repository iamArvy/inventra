import { NestFactory } from '@nestjs/core';
// import { SuperuserSeeder } from './superuser.seeder';
import { PermissionSeeder } from './seeders/permission.seeder';
import { UserSeeder } from './seeders/user.seeder';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  interface Seeder {
    seed: () => Promise<void>;
  }

  const seeders: Record<string, Seeder> = {
    permissions: app.get(PermissionSeeder),
    // roles: app.get(RoleSeeder),
    // superuser: app.get(SuperuserSeeder),
    users: app.get(UserSeeder),
  };

  // const seeder = app.get(SuperuserSeeder);
  const type = process.argv[2];

  console.log(type);
  if (type && seeders[type]) {
    await seeders[type].seed();
  } else {
    // Run all seeders
    for (const key in seeders) {
      console.log(`Seeding: ${key}`);
      await seeders[key].seed();
    }
  }
  // await seeder.seedSuperuser();
  await app.close();
}
bootstrap();
