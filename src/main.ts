import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
// import { TenantMiddleware } from './tenant/tenant.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT ?? 3000);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable when not using GraphQL
  // app.use(new TenantMiddleware().use);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🚀 GraphQL Playground is running on: http://localhost:${port}/graphql`,
  );
}
bootstrap();
