import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Failed to start TokenSlash MCP server:', message);
  process.exit(1);
});
