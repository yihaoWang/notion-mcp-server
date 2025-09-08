import { IToolHandler, INotionService, ToolResponse, QueryDatabaseParams } from '../types.js';
import { Validator } from '../errors.js';

export class QueryDatabaseHandler implements IToolHandler {
  constructor(private notionService: INotionService) {}

  async handle(args: QueryDatabaseParams): Promise<ToolResponse> {
    Validator.validateString(args.databaseId, 'databaseId');

    const result = await this.notionService.queryDatabase(
      args.databaseId,
      args.filter,
      args.sorts
    );

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