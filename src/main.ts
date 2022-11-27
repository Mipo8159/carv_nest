if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  await app.listen(3000, () => console.log(`server running on port: ${3000}`));
}
bootstrap();
