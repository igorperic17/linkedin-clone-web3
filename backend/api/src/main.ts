import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://coredin.rubentewierik.dev'
  });
  await app.listen(3000);
}
bootstrap();
