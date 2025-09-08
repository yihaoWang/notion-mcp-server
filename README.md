# Notion MCP Server

A Model Context Protocol (MCP) server that provides integration with the Notion API, allowing AI assistants to interact with Notion pages and databases.

## Features

- Search for pages and databases in Notion
- Retrieve page information and content
- Create new pages
- Query databases with filters and sorting
- Full integration with Notion's API capabilities

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Notion API

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "MCP Server")
4. Select the workspace
5. Copy the "Internal Integration Token"

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Notion API key:

```
NOTION_API_KEY=your_notion_integration_token_here
```

### 4. Share pages/databases with your integration

For the integration to access your Notion pages and databases, you need to share them:

1. Go to the page or database you want to access
2. Click "Share" in the top right
3. Click "Invite" and select your integration

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Watch mode
npm run watch
```

## Available Tools

### search_notion
Search for pages and databases in Notion.

**Parameters:**
- `query` (string): Search query

### get_page
Get a Notion page by ID.

**Parameters:**
- `pageId` (string): Page ID

### get_page_content
Get the content/blocks of a Notion page.

**Parameters:**
- `pageId` (string): Page ID

### create_page
Create a new page in Notion.

**Parameters:**
- `title` (string): Page title
- `parentId` (string, optional): Parent page or database ID
- `content` (string, optional): Page content as markdown

### query_database
Query a Notion database.

**Parameters:**
- `databaseId` (string): Database ID
- `filter` (object, optional): Filter object
- `sorts` (array, optional): Sort array

## Usage with Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["/path/to/notion-mcp-server/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "your_notion_integration_token_here"
      }
    }
  }
}
```

## License

MIT