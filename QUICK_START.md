# Quick Start Guide

## 🚀 Getting Started (2 minutes)

### 1. Run Tests
```bash
npm run test
```

### 2. Set Up Notion Integration
1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Copy the integration token

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env and add: NOTION_API_KEY=secret_your_token_here
```

### 4. Share Content with Integration
1. Open a Notion page
2. Click "Share" → "Invite" 
3. Select your integration

### 5. Start Server
```bash
npm run dev
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run automated tests |
| `npm run build` | Build TypeScript |
| `npm run dev` | Start development server (refactored) |
| `npm run start` | Start production server |
| `npm run watch` | Start with auto-reload |

## 🛠 Available Tools

| Tool | Purpose | Required Args |
|------|---------|---------------|
| `search_notion` | Search pages/databases | `query` |
| `get_page` | Get page info | `pageId` |
| `get_page_content` | Get page blocks | `pageId` |
| `create_page` | Create new page | `title` |
| `query_database` | Query database | `databaseId` |

## 🔍 Testing Individual Tools

### Search Example
```bash
# Use MCP Inspector
npx @modelcontextprotocol/inspector node dist/main.js
```

Then send:
```json
{
  "method": "tools/call",
  "params": {
    "name": "search_notion",
    "arguments": { "query": "test" }
  }
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key required" | Check `.env` file exists with valid key |
| "Object not found" | Share page/database with integration |
| Build fails | Run `npm install` then `npm run build` |
| Server won't start | Check Node.js version (v18+) |

## 📱 Claude Desktop Integration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["/full/path/to/notion-mcp-server/dist/main.js"],
      "env": {
        "NOTION_API_KEY": "secret_your_token_here"
      }
    }
  }
}
```

## 🎯 Success Indicators

- ✅ `npm run test` shows all tests passing
- ✅ Server starts with "Notion MCP server running on stdio"
- ✅ Search returns your Notion content
- ✅ Can create/read pages through the server