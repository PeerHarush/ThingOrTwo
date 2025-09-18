import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 3000);
}

// מטפל בשגיאות אתחול
bootstrap().catch((err) => {
  console.error('❌ Failed to start NestJS app:', err);
  process.exit(1);
});
