#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

class NotionMCPServer {
  private server: Server;
  private notion: Client;

  constructor() {
    this.server = new Server(
      {
        name: "notion-mcp-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const notionApiKey = process.env.NOTION_API_KEY;
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY environment variable is required");
    }

    this.notion = new Client({
      auth: notionApiKey,
    });

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "search_notion",
            description: "Search for pages and databases in Notion",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query",
                },
              },
              required: ["query"],
            },
          },
          {
            name: "get_page",
            description: "Get a Notion page by ID",
            inputSchema: {
              type: "object",
              properties: {
                pageId: {
                  type: "string",
                  description: "Page ID",
                },
              },
              required: ["pageId"],
            },
          },
          {
            name: "get_page_content",
            description: "Get the content/blocks of a Notion page",
            inputSchema: {
              type: "object",
              properties: {
                pageId: {
                  type: "string",
                  description: "Page ID",
                },
              },
              required: ["pageId"],
            },
          },
          {
            name: "create_page",
            description: "Create a new page in Notion",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Page title",
                },
                parentId: {
                  type: "string",
                  description: "Parent page or database ID (optional)",
                },
                content: {
                  type: "string",
                  description: "Page content as markdown (optional)",
                },
              },
              required: ["title"],
            },
          },
          {
            name: "query_database",
            description: "Query a Notion database",
            inputSchema: {
              type: "object",
              properties: {
                databaseId: {
                  type: "string",
                  description: "Database ID",
                },
                filter: {
                  type: "object",
                  description: "Filter object (optional)",
                },
                sorts: {
                  type: "array",
                  description: "Sort array (optional)",
                },
              },
              required: ["databaseId"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new McpError(ErrorCode.InvalidParams, "Missing arguments");
      }

      try {
        switch (name) {
          case "search_notion":
            return await this.searchNotion(args.query as string);

          case "get_page":
            return await this.getPage(args.pageId as string);

          case "get_page_content":
            return await this.getPageContent(args.pageId as string);

          case "create_page":
            return await this.createPage(
              args.title as string,
              args.parentId as string,
              args.content as string
            );

          case "query_database":
            return await this.queryDatabase(
              args.databaseId as string,
              args.filter as any,
              args.sorts as any
            );

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async searchNotion(query: string) {
    const response = await this.notion.search({
      query,
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.results, null, 2),
        },
      ],
    };
  }

  private async getPage(pageId: string) {
    const response = await this.notion.pages.retrieve({
      page_id: pageId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  private async getPageContent(pageId: string) {
    const response = await this.notion.blocks.children.list({
      block_id: pageId,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.results, null, 2),
        },
      ],
    };
  }

  private async createPage(title: string, parentId?: string, content?: string) {
    const pageData: any = {
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    };

    if (parentId) {
      pageData.parent = {
        page_id: parentId,
      };
    }

    if (content) {
      pageData.children = [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ];
    }

    const response = await this.notion.pages.create(pageData);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2),
        },
      ],
    };
  }

  private async queryDatabase(databaseId: string, filter?: any, sorts?: any) {
    const queryOptions: any = {
      database_id: databaseId,
    };

    if (filter) {
      queryOptions.filter = filter;
    }

    if (sorts) {
      queryOptions.sorts = sorts;
    }

    const response = await (this.notion.databases as any).query(queryOptions);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.results, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Notion MCP server running on stdio");
  }
}

const server = new NotionMCPServer();
server.run().catch(console.error);