import { IToolHandler, INotionService, ToolResponse, PageParams, CreatePageParams } from '../types.js';
import { Validator } from '../errors.js';

export class GetPageHandler implements IToolHandler {
  constructor(private notionService: INotionService) {}

  async handle(args: PageParams): Promise<ToolResponse> {
    Validator.validateString(args.pageId, 'pageId');

    const result = await this.notionService.getPage(args.pageId);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}

export class GetPageContentHandler implements IToolHandler {
  constructor(private notionService: INotionService) {}

  async handle(args: PageParams): Promise<ToolResponse> {
    Validator.validateString(args.pageId, 'pageId');

    const result = await this.notionService.getPageContent(args.pageId);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result.results, null, 2),
        },
      ],
    };
  }
}

export class CreatePageHandler implements IToolHandler {
  constructor(private notionService: INotionService) {}

  async handle(args: CreatePageParams): Promise<ToolResponse> {
    Validator.validateString(args.title, 'title');

    const result = await this.notionService.createPage(
      args.title,
      args.parentId,
      args.content
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}