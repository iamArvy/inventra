import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Emporium Store Dashboard API')
    .setDescription('Emporium Store Dashboard API')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact(
      'iamArvy',
      'https://iamarvy.netlify.app',
      'iamarvy.tech@gmail.com',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
