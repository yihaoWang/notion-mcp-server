import { Config } from './types.js';
import dotenv from 'dotenv';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    dotenv.config();
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }

    return {
      notionApiKey,
      serverName: 'notion-mcp-server',
      serverVersion: '0.1.0'
    };
  }

  public getConfig(): Config {
    return this.config;
  }

  public getNotionApiKey(): string {
    return this.config.notionApiKey;
  }
}