# Hex AI

> **Autonomous AI assistant for the EigenLayer staking ecosystem**

Hex AI combines multi-agent analysis workflows with a conversational interface to help users navigate the complexity of restaking protocols, AVSs (Actively Validated Services), and operator management.

## 🎯 Key Features

- **🤖 Multi-Agent Intelligence**: Parallel AI workflows analyze AVSs and operators across technical, economic, operational, market, and systemic risk dimensions
- **💬 Conversational Interface**: Chat with specialized agents for staking, AVS management, operator operations, and DeFi interactions
- **🔍 Real-time Analysis**: Continuous monitoring of EigenLayer ecosystem with sentiment analysis, GitHub activity, and DeFi metrics
- **⚡ Transaction Execution**: Execute EVM transactions, manage operator sets, submit rewards, and handle slashing operations
- **💱 DEX Integration**: Swap tokens and manage liquidity via Odos aggregator
- **🔗 Multi-chain Support**: Mainnet, Holesky, and Sepolia testnet support via RainbowKit wallet integration

## 🏗️ Architecture

Hex AI is a **pnpm monorepo** with two main applications and shared packages:

```
hex-ai/
├── apps/
│   ├── agent/          # Hono server with AI agents (port 8042)
│   └── web/            # Next.js 15 web interface
├── packages/
│   ├── database/       # Drizzle ORM + Neon Postgres
│   ├── ui/             # Radix UI component library
│   ├── evm-mcp-server/ # MCP server for EVM operations
│   └── mcp-odos/       # MCP server for DEX operations
```

### Agent Service (`apps/agent`)

Multi-agent system powered by `@iqai/adk` (AI Development Kit) with Azure OpenAI:

**Chat Agents** (user-facing):

- `stacker-agent`: EigenLayer staking operations
- `avs-agent`: AVS management (operator sets, rewards, slashing)
- `operator-agent`: Operator operations
- `analysis-agent`: Fetch stored AI analysis
- `execution-agent`: Execute EVM transactions
- `liquidity-agent`: DEX interactions

**Workflow Agents** (background analysis):

- **AVS Analysis**: Parallel web research, social sentiment, and 5-category risk scoring
- **Operator Analysis**: Similar multi-dimensional operator evaluation (coming soon)

### Web Interface (`apps/web`)

Next.js 15 application with:

- RainbowKit + Wagmi for wallet integration
- TanStack Query for state management
- Server-Sent Events (SSE) for real-time agent responses
- Dark mode support via next-themes

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1+
- PostgreSQL database (Neon recommended)
- Azure OpenAI API access

### Installation

```bash
# Install dependencies
pnpm install

# Build MCP packages (required first)
pnpm build:mcp

# Build all packages
pnpm build
```

### Environment Setup

**Agent Service** (`apps/agent/.env`):

```env
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_RESOURCE_NAME=your_resource_name
AZURE_OPENAI_API_VERSION=2024-05-01-preview
AZURE_DEPLOYMENT_NAME=gpt-4

# Application
WEB_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host/dbname
```

**Web App** (`apps/web/.env.local`):

```env
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8042
```

### Running the Project

After building packages, you can start both applications:

**Option 1 - Both apps simultaneously (from root):**

```bash
pnpm dev
# Starts both agent (port 8042) and web (port 3000) via Turbo
```

**Option 2 - Individual apps (separate terminals):**

**Terminal 1 - Agent Service:**

```bash
cd apps/agent
pnpm dev
# Runs on http://localhost:8042
```

**Terminal 2 - Web Interface:**

```bash
cd apps/web
pnpm dev
# Runs on http://localhost:3000
```

Visit `http://localhost:3000` to start chatting with Hex AI!

## 🔬 Running Analysis Workflows

Hex AI can analyze AVSs in the background and store results in the database:

```bash
cd apps/agent

# Manual approval for each AVS
pnpm workflow:avs

# Auto-approve all AVSs
pnpm workflow:avs:auto

# Test workflow without saving
pnpm workflow:avs:skip
```

Results are stored in the `monitoredAVS.analysis` JSONB field and accessible via the `analysis-agent` in chat.

## 🗄️ Database Management

```bash
cd packages/database

# Generate migration after schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed
```

## 📦 Package Scripts

**Root workspace:**

```bash
pnpm dev       # Start all apps in development mode
pnpm build     # Build all packages and apps
pnpm lint      # Lint all workspaces
pnpm format    # Format code with Prettier
```

**Web app:**

```bash
pnpm dev       # Start Next.js dev server
pnpm build     # Build for production
pnpm typecheck # Type check without building
pnpm lint:fix  # Auto-fix linting issues
```

**Agent service:**

```bash
pnpm dev            # Start Hono server with hot reload
pnpm build          # Compile TypeScript to dist/
pnpm workflow:avs   # Run AVS analysis workflow
```

## 🛠️ Technology Stack

**Frontend:**

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Radix UI
- RainbowKit + Wagmi v2
- TanStack Query

**Backend:**

- Hono (lightweight web framework)
- @iqai/adk (AI Development Kit)
- Azure OpenAI
- Drizzle ORM
- Neon Postgres

**Tooling:**

- pnpm (package manager)
- Turborepo (monorepo build system)
- TypeScript 5.7
- ESLint + Prettier

## 🧩 Adding Workspace Dependencies

Internal packages use the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@hex-ai/database": "workspace:*",
    "@hex-ai/ui": "workspace:*"
  }
}
```

## 📚 Key Concepts

### MCP (Model Context Protocol)

Hex AI uses MCP servers to provide tools to AI agents:

- `evm-mcp-server`: 22 EVM tools across 60+ networks
- `mcp-odos`: DEX aggregation for token swaps

### Agent Workflows

Agents can run in parallel phases followed by aggregation:

```typescript
AgentBuilder.create("workflow")
  .asSequential([
    // Phase 1: Parallel
    AgentBuilder.create("parallel")
      .asParallel([agent1, agent2, agent3])
      .build(),
    // Phase 2: Aggregate
    aggregatorAgent,
  ])
  .build();
```

### Conversational Wallet State

Agents extract wallet addresses and chain preferences from natural language conversations, not just UI state.

## 🤝 Contributing

1. Create a feature branch
2. Make changes following the project conventions (see `.github/copilot-instructions.md`)
3. Run `pnpm typecheck` and `pnpm lint` before committing
4. Submit a pull request

## 📄 License

[Add your license here]

## 🔗 Links

- [IQ AI Tokenized Agent](https://app.iqai.com/pending/0x4dE3BD3Bf9A14f65B2e28E421f5235cd02FDBc50)

---

**Built with ❤️ by [Afolabi Abdulsamad](https://github.com/afolabi-abdulsamad)**
