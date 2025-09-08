# Notion MCP Server - Usage & Testing Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Notion Integration** set up
3. **Notion API Key**

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Notion Integration
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name: "MCP Server" (or any name you prefer)
4. Select your workspace
5. Copy the "Internal Integration Token"

### 3. Configure Environment
```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your token
echo "NOTION_API_KEY=secret_your_integration_token_here" > .env
```

### 4. Share Content with Integration
For the integration to access your Notion content:
1. Go to any page/database you want to test with
2. Click "Share" → "Invite"
3. Select your integration from the dropdown
4. Click "Invite"

## Running the Server

### Development Mode (Refactored Version)
```bash
npm run dev
```

### Development Mode (Original Version)
```bash
npm run dev:old
```

### Production Build
```bash
npm run build
npm start
```

### Watch Mode
```bash
npm run watch
```

## Testing the Server

### 1. Basic Server Test
Test if the server starts correctly:
```bash
# Should show: "Notion MCP server running on stdio"
NOTION_API_KEY=test npm run dev
```

### 2. Manual Testing with MCP Inspector

Install MCP Inspector for interactive testing:
```bash
npx @modelcontextprotocol/inspector node dist/main.js
```

### 3. Testing Individual Tools

#### Test Search
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_notion",
    "arguments": {
      "query": "your search term"
    }
  }
}
```

#### Test Get Page
```json
{
  "method": "tools/call", 
  "params": {
    "name": "get_page",
    "arguments": {
      "pageId": "your-page-id-here"
    }
  }
}
```

#### Test Create Page
```json
{
  "method": "tools/call",
  "params": {
    "name": "create_page", 
    "arguments": {
      "title": "Test Page Created by MCP",
      "content": "This page was created via the MCP server!"
    }
  }
}
```

#### Test Database Query
```json
{
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "databaseId": "your-database-id-here"
    }
  }
}
```

## Integration with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["/absolute/path/to/notion-mcp-server/dist/main.js"],
      "env": {
        "NOTION_API_KEY": "secret_your_integration_token_here"
      }
    }
  }
}
```

## Finding Notion IDs

### Page ID
From a Notion page URL: `https://notion.so/Page-Name-1a2b3c4d5e6f...`
- Page ID is: `1a2b3c4d5e6f...` (the part after the last dash)

### Database ID  
From a database URL: `https://notion.so/Database-Name-9a8b7c6d5e4f...`
- Database ID is: `9a8b7c6d5e4f...` (the part after the last dash)

## Troubleshooting

### Common Issues

#### "NOTION_API_KEY environment variable is required"
- Ensure `.env` file exists with valid API key
- Check the key starts with `secret_`

#### "Object not found" errors
- Page/database not shared with integration
- Invalid page/database ID
- Integration doesn't have access to workspace

#### TypeScript compilation errors
```bash
# Clean build
rm -rf dist/
npm run build
```

#### Server won't start
```bash
# Check Node.js version
node --version  # Should be v18+

# Check dependencies
npm install

# Try with verbose logging
DEBUG=* npm run dev
```

### Debug Mode
For detailed logging:
```bash
DEBUG=mcp* npm run dev
```

## Testing Checklist

- [ ] Server starts without errors
- [ ] Environment variables loaded correctly
- [ ] Search returns results from your Notion workspace
- [ ] Can retrieve a specific page by ID
- [ ] Can get page content/blocks
- [ ] Can create new pages
- [ ] Can query databases (if you have shared databases)
- [ ] Error handling works (try invalid page IDs)
- [ ] Integration works with Claude Desktop

## Performance Testing

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create test script (artillery.yml)
# Then run:
artillery run artillery.yml
```

### Memory Usage
```bash
# Monitor memory usage
node --inspect dist/main.js
```

## Next Steps

Once everything is working:
1. Create more specific tools for your use case
2. Add custom database queries with filters
3. Implement page content parsing for better formatting
4. Add caching for frequently accessed content
5. Set up logging and monitoring

## Support

- Check the error logs for specific issues
- Ensure Notion integration has proper permissions
- Verify page/database IDs are correct and accessible