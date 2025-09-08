import { IToolHandler, INotionService, ToolResponse, SearchParams } from '../types.js';
import { Validator } from '../errors.js';

export class SearchHandler implements IToolHandler {
  constructor(private notionService: INotionService) {}

  async handle(args: SearchParams): Promise<ToolResponse> {
    Validator.validateString(args.query, 'query');

    const result = await this.notionService.search(args.query);

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