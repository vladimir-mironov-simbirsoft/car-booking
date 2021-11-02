import { NestFactory } from '@nestjs/core';
import { HTTPModule } from './http/http.module';

async function bootstrap() {
  const appV1 = await NestFactory.create(HTTPModule, { logger: ['log', 'warn', 'error'] });
  appV1.setGlobalPrefix('/api/v1');
  await appV1.listen(3000);
}

bootstrap();
