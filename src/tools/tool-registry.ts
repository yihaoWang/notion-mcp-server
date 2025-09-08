import { ITool, INotionService } from '../types.js';
import { SearchHandler } from '../handlers/search-handler.js';
import { GetPageHandler, GetPageContentHandler, CreatePageHandler } from '../handlers/page-handler.js';
import { QueryDatabaseHandler } from '../handlers/database-handler.js';

export class ToolRegistry {
  private tools: Map<string, ITool> = new Map();

  constructor(notionService: INotionService) {
    this.registerTools(notionService);
  }

  private registerTools(notionService: INotionService): void {
    const tools: ITool[] = [
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
        handler: new SearchHandler(notionService),
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
        handler: new GetPageHandler(notionService),
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
        handler: new GetPageContentHandler(notionService),
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
        handler: new CreatePageHandler(notionService),
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
        handler: new QueryDatabaseHandler(notionService),
      },
    ];

    tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }
}