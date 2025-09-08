import { ConfigManager } from './config.js';
import { NotionService } from './services/notion-service.js';
import { ToolRegistry } from './tools/tool-registry.js';
import { MCPServer } from './server.js';

export class ServerFactory {
  static createServer(): MCPServer {
    const configManager = ConfigManager.getInstance();
    const config = configManager.getConfig();
    
    const notionService = new NotionService(config.notionApiKey);
    const toolRegistry = new ToolRegistry(notionService);
    
    return new MCPServer(config, toolRegistry);
  }
}