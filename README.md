<a href="https://mcp.scira.ai">
  <h1 align="center">Scira MCP Chat</h1>
</a>

<p align="center">
  An open-source AI chatbot app powered by Model Context Protocol (MCP), built with Next.js and the AI SDK by Vercel.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> •
  <a href="#local-development"><strong>Local Development</strong></a> •
  <a href="#mcp-server-configuration"><strong>MCP Configuration</strong></a> •
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Features

- Streaming text responses powered by the [AI SDK by Vercel](https://sdk.vercel.ai/docs), allowing multiple AI providers to be used interchangeably with just a few lines of code.
- Full integration with [Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers to expand available tools and capabilities.
- HTTP and SSE transport types for connecting to various MCP tool providers.
- Built-in tool integration for extending AI capabilities.
- Reasoning model support.
- [shadcn/ui](https://ui.shadcn.com/) components for a modern, responsive UI powered by [Tailwind CSS](https://tailwindcss.com).
- Built with the latest [Next.js](https://nextjs.org) App Router.

## Local Development

### Prerequisites

- **Node.js** 18+ and **pnpm** (or npm/yarn)
- **Docker** and **Docker Compose** (recommended for database)
- **PostgreSQL** database (local, Docker, or remote)
- **AI Provider API Keys** (at least one):
  - Groq API Key (recommended for default models)
  - XAI API Key (for Grok models)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiaan720/mcp-chat.git
   cd mcp-chat
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure the following:
   ```bash
   # Database (Required)
   DATABASE_URL="postgresql://username:password@localhost:5432/mcp_chat"
   
   # AI Provider API Keys (At least one required)
   GROQ_API_KEY="your_groq_api_key_here"    # For Qwen3, Kimi-K2, Llama4 models
   XAI_API_KEY="your_xai_api_key_here"      # For Grok models
   ```

4. **Set up the database**
   
   **Option A: Use Neon (Recommended for quick setup)**
   ```bash
   # Sign up at https://neon.tech
   # Create a new project and database
   # Copy the connection string to your .env.local file
   ```
   
   **Option B: Docker PostgreSQL (For local development)**
   ```bash
   # Start PostgreSQL with Docker Compose
   docker-compose up -d postgres
   
   # Verify the database is running
   docker-compose ps
   ```
   
   **Option C: Local PostgreSQL**
   ```bash
   # Install PostgreSQL (macOS with Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Create database
   createdb mcp_chat
   ```
   
   If using Neon (Option A), your `DATABASE_URL` should be the connection string from Neon.
   If using Docker (Option B), your `DATABASE_URL` should be:
   ```bash
   DATABASE_URL="postgres://mcp_user:mcp_password@localhost:5432/mcp_chat"
   ```
   
   For other options, update your `DATABASE_URL` in `.env.local` with your database connection string.
   
   **Note:** This application is optimized for Neon's serverless PostgreSQL. For local development with Docker, you may encounter some database connection issues that we're working to resolve. For the best experience, we recommend using Neon for both development and production.

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```
   
   The app will be available at [http://localhost:3000](http://localhost:3000)

### Getting AI API Keys

**Groq API Key (Recommended)**
1. Visit [Groq Console](https://console.groq.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Add it to your `.env.local` as `GROQ_API_KEY`

**XAI API Key (Optional)**
1. Visit [XAI Console](https://x.ai)
2. Sign up for an account
3. Generate an API key
4. Add it to your `.env.local` as `XAI_API_KEY`

### Database Management

The project uses [Drizzle ORM](https://orm.drizzle.team) for database management:

```bash
# Generate new migrations after schema changes
pnpm db:generate

# Apply migrations to your database
pnpm db:migrate

# Push schema changes directly (development only)
pnpm db:push

# Open Drizzle Studio to view/edit data
pnpm db:studio
```

### Docker Database Management

If you're using Docker for PostgreSQL:

```bash
# Start the database
docker-compose up -d postgres

# Stop the database
docker-compose down

# View database logs
docker-compose logs postgres

# Access PostgreSQL CLI
docker-compose exec postgres psql -U mcp_user -d mcp_chat

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d postgres
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio
```

### Troubleshooting

**Database Connection Issues**
- Ensure PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Check that the database exists
- **For local PostgreSQL with Docker:** The app is optimized for Neon's serverless driver. You may see connection errors when using local PostgreSQL. Consider using Neon for development.

**Missing API Keys**
- The app will show errors if no AI provider keys are configured
- You need at least one API key (Groq recommended)
- API keys can be added through the UI settings or environment variables

**Build/Runtime Errors**
- Make sure all dependencies are installed: `pnpm install`
- Clear Next.js cache: `rm -rf .next`
- Restart the development server

### Current Status

✅ **Working Features:**
- Docker PostgreSQL setup and database creation
- Next.js application startup
- Database schema migration
- UI rendering

⚠️ **Known Issues:**
- Database connection errors with local PostgreSQL (due to Neon serverless driver optimization)
- Missing AI API keys will show errors (expected until configured)

🎯 **Recommended Setup:**
For the best development experience, use [Neon](https://neon.tech) instead of local PostgreSQL, as the application is optimized for Neon's serverless PostgreSQL driver.

## MCP Server Configuration

This application supports connecting to Model Context Protocol (MCP) servers to access their tools. You can add and manage MCP servers through the settings icon in the chat interface.

### Adding an MCP Server

1. Click the settings icon (⚙️) next to the model selector in the chat interface.
2. Enter a name for your MCP server.
3. Select the transport type:
   - **HTTP**: For HTTP-based remote servers
   - **SSE (Server-Sent Events)**: For SSE-based remote servers

#### HTTP or SSE Configuration

1. Enter the server URL (e.g., `https://mcp.example.com/mcp` or `https://mcp.example.com/token/sse`)
2. Click "Add Server"
3. Click "Enable Server" to activate the server for the current chat session.

### Available MCP Servers

You can use any MCP-compatible server with this application. Here are some examples:

- [Composio](https://composio.dev/mcp) - Provides search, code interpreter, and other tools
- [Zapier MCP](https://zapier.com/mcp) - Provides access to Zapier tools
- [Hugging Face MCP](https://huggingface.co/mcp) - Provides tool access to Hugging Face Hub
- Any MCP server compatible with HTTP or SSE transport

## Deploying new changes to vercel:

```bash
vercel --prod
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.