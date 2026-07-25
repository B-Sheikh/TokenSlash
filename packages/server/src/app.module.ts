import { ConfigModule, McpApp, Module } from '@nitrostack/core';
import { TokenSlashModule } from './modules/tokenslash.module.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'tokenslash-server',
    version: '0.1.0',
  },
  logging: {
    level: 'info',
  },
})
@Module({
  name: 'app',
  description: 'TokenSlash MCP server root module',
  imports: [ConfigModule.forRoot(), TokenSlashModule],
})
export class AppModule {}
