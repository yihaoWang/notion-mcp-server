export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export interface SearchParams {
  query: string;
}

export interface PageParams {
  pageId: string;
}

export interface CreatePageParams {
  title: string;
  parentId?: string;
  content?: string;
}

export interface QueryDatabaseParams {
  databaseId: string;
  filter?: any;
  sorts?: any;
}

export interface Config {
  notionApiKey: string;
  serverName: string;
  serverVersion: string;
}

export interface INotionService {
  search(query: string): Promise<any>;
  getPage(pageId: string): Promise<any>;
  getPageContent(pageId: string): Promise<any>;
  createPage(title: string, parentId?: string, content?: string): Promise<any>;
  queryDatabase(databaseId: string, filter?: any, sorts?: any): Promise<any>;
}

export interface IToolHandler {
  handle(args: any): Promise<ToolResponse>;
}

export interface ITool {
  name: string;
  description: string;
  inputSchema: object;
  handler: IToolHandler;
}