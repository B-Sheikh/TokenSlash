import { ConfigModule, McpApp, Module, OAuthModule } from '@nitrostack/core';
import { TokenSlashModule } from './modules/tokenslash.module.js';

@McpApp({
  module: AppModule,
  server: {
    name: 'tokenslash-server',
    version: '0.1.0',
  },
  transport: {
    type: 'dual',
    http: {
      host: '0.0.0.0',
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    },
  },
  logging: {
    level: 'info',
  },
})
@Module({
  name: 'app',
  description: 'TokenSlash MCP server root module',
  imports: [
    ConfigModule.forRoot(),
    OAuthModule.forRoot({
      resourceUri: process.env.RESOURCE_URI || 'http://0.0.0.0:3000',
      authorizationServers: [process.env.RESOURCE_URI || 'http://0.0.0.0:3000'],
      required: false,
    }),
    TokenSlashModule,
  ],
})
export class AppModule {}
