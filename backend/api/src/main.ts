import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: 'https://coredin.rubentewierik.dev', allowedHeaders: [ 'HEAD', 'OPTIONS', 'GET', 'POST'] }});
  await app.listen(3000);
}
bootstrap();
