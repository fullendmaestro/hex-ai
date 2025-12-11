# ============================================
# Build Stage - Install all deps and build
# ============================================
FROM node:20-alpine AS builder

# Enable pnpm package manager and set a specific version for consistency
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Install bun for building evm-mcp-server
RUN npm install -g bun

# Set the working directory inside the container
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all packages and apps needed for the monorepo
COPY packages ./packages
COPY apps/agent ./apps/agent

# Install all dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Build the EVM MCP server first
RUN cd packages/evm-mcp-server && bun run build

# Build the ODOS MCP server (new package added)
RUN cd packages/mcp-odos && pnpm run build

# Build the agent application (using docker build script that doesn't need rimraf)
RUN cd apps/agent && pnpm run build:docker

# ============================================
# Production Stage - Optimized runtime image
# ============================================
FROM node:20-alpine AS runner

# Enable pnpm package manager
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Install ADK CLI globally
RUN npm install -g @iqai/adk-cli

# Set the working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all packages and apps (source code needed for workspace resolution)
COPY packages ./packages
COPY apps/agent/package.json ./apps/agent/package.json
COPY apps/agent/tsconfig.json ./apps/agent/tsconfig.json
COPY apps/agent/src ./apps/agent/src

# Copy built files from builder stage
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist

# Copy built EVM MCP server from builder stage
COPY --from=builder /app/packages/evm-mcp-server/build ./packages/evm-mcp-server/build

# Copy built ODOS MCP server from builder stage
COPY --from=builder /app/packages/mcp-odos/dist ./packages/mcp-odos/dist

# Install production dependencies (ignore scripts to skip husky and other dev-only prepare scripts)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Change to the agent directory
WORKDIR /app/apps/agent

# Expose the ADK server port
EXPOSE 8042

# Define the command to run when the container starts
# Bind to 0.0.0.0 to accept connections from outside the container
CMD ["adk", "serve", "--host", "0.0.0.0"]
