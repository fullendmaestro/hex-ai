# Use Node.js 20 Alpine as the base image (lightweight Linux distribution)
FROM node:20-alpine

# Enable pnpm package manager and set a specific version for consistency
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Set the working directory inside the container
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all packages and apps needed for the monorepo
COPY packages ./packages
COPY apps/agent ./apps/agent

# Install dependencies using frozen lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Build the agent application
RUN pnpm --filter hono build

# Set production environment
ENV NODE_ENV=production

# Change to the agent directory
WORKDIR /app/apps/agent

# Define the command to run when the container starts
CMD ["pnpm", "exec", "adk", "serve"]
