import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Config } from './types.js';
import { ToolRegistry } from './tools/tool-registry.js';
import { ErrorHandler } from './errors.js';

export class MCPServer {
  private server: Server;
  private toolRegistry: ToolRegistry;

  constructor(config: Config, toolRegistry: ToolRegistry) {
    this.server = new Server(
      {
        name: config.serverName,
        version: config.serverVersion,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.toolRegistry = toolRegistry;
    this.setupRequestHandlers();
  }

  private setupRequestHandlers(): void {
    this.setupListToolsHandler();
    this.setupCallToolHandler();
  }

  private setupListToolsHandler(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = this.toolRegistry.getAllTools();
      
      return {
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      };
    });
  }

  private setupCallToolHandler(): void {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        ErrorHandler.handleInvalidParams("Missing arguments");
      }

      const tool = this.toolRegistry.getTool(name);
      if (!tool) {
        ErrorHandler.handleMethodNotFound(name);
      }

      try {
        const result = await tool.handler.handle(args);
        return result as any;
      } catch (error) {
        ErrorHandler.handleToolError(name, error);
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Notion MCP server running on stdio");
  }
}