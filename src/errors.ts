import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";

export class ErrorHandler {
  static handleToolError(toolName: string, error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing ${toolName}: ${message}`
    );
  }

  static handleInvalidParams(message: string): never {
    throw new McpError(ErrorCode.InvalidParams, message);
  }

  static handleMethodNotFound(methodName: string): never {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${methodName}`);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validator {
  static validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  static validateString(value: any, fieldName: string): void {
    this.validateRequired(value, fieldName);
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`);
    }
  }
}