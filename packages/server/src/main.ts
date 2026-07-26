import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

// Force 0.0.0.0 host binding for Docker container cloud ingress to prevent 502 Bad Gateway
process.env.HOST = '0.0.0.0';
process.env.NITRO_HOST = '0.0.0.0';
if (!process.env.PORT) {
  process.env.PORT = '3000';
}

async function bootstrap(): Promise<void> {
  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Failed to start TokenSlash MCP server:', message);
  process.exit(1);
});
