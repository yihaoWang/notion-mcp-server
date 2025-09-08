import { Client } from "@notionhq/client";
import { INotionService } from '../types.js';
import { ErrorHandler } from '../errors.js';

export class NotionService implements INotionService {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  async search(query: string): Promise<any> {
    try {
      return await this.client.search({
        query,
        sort: {
          direction: "descending",
          timestamp: "last_edited_time",
        },
      });
    } catch (error) {
      ErrorHandler.handleToolError('search_notion', error);
    }
  }

  async getPage(pageId: string): Promise<any> {
    try {
      return await this.client.pages.retrieve({
        page_id: pageId,
      });
    } catch (error) {
      ErrorHandler.handleToolError('get_page', error);
    }
  }

  async getPageContent(pageId: string): Promise<any> {
    try {
      return await this.client.blocks.children.list({
        block_id: pageId,
      });
    } catch (error) {
      ErrorHandler.handleToolError('get_page_content', error);
    }
  }

  async createPage(title: string, parentId?: string, content?: string): Promise<any> {
    try {
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

      return await this.client.pages.create(pageData);
    } catch (error) {
      ErrorHandler.handleToolError('create_page', error);
    }
  }

  async queryDatabase(databaseId: string, filter?: any, sorts?: any): Promise<any> {
    try {
      const queryOptions: any = {
        database_id: databaseId,
      };

      if (filter) {
        queryOptions.filter = filter;
      }

      if (sorts) {
        queryOptions.sorts = sorts;
      }

      return await (this.client.databases as any).query(queryOptions);
    } catch (error) {
      ErrorHandler.handleToolError('query_database', error);
    }
  }
}