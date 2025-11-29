# Hex AI - Copilot Instructions

## Project Overview

Hex AI is a decentralized app assistant built with Next.js. The project uses a pnpm workspace monorepo managed by Turborepo.

## Architecture

### Monorepo Structure

- **apps/web**: Next.js 15 application (App Router)
- **packages/ui**: Shared React component library built on Radix UI primitives and Tailwind CSS
- **packages/eslint-config**: ESLint configurations for Next.js and React
- **packages/typescript-config**: Shared TypeScript configurations

### Package Naming Convention

Internal packages use the `@hex-ai/*` namespace (e.g., `@hex-ai/ui`, `@hex-ai/eslint-config`). The web app is simply named `web`.

## Development Workflow

### Running the Project

```bash
pnpm dev          # Start all apps in dev mode (Turbo)
pnpm build        # Build all apps and packages
pnpm lint         # Lint all workspaces
pnpm format       # Format code with Prettier
```

### Adding Dependencies

- App dependencies: `cd apps/web && pnpm add <package>`
- UI package dependencies: `cd packages/ui && pnpm add <package>`
- Workspace dependencies: Use `workspace:*` or `workspace:^` protocol

### Development Server

The web app runs on Next.js dev server. Use `turbo dev` from root to enable parallel development of multiple apps if needed.

## Key Technical Patterns

### Component Library Usage

Import from `@hex-ai/ui` using subpath exports:

```tsx
import { Button } from "@hex-ai/ui/components/button";
import { cn } from "@hex-ai/ui/lib/utils";
import "@hex-ai/ui/globals.css"; // Import global styles in layout.tsx
```

### Styling Approach

- Tailwind CSS v4 (with `@tailwindcss/postcss` plugin)
- `cn()` utility (clsx + tailwind-merge) for conditional classes
- Radix UI primitives for accessible, unstyled components
- Theme support via `next-themes` (see `apps/web/components/providers.tsx`)

### TypeScript Configuration

- Root extends `@hex-ai/typescript-config/base.json`
- Web app extends `@hex-ai/typescript-config/nextjs.json`
- Use path aliases: `@/*` for app-level imports, `@hex-ai/ui/*` for direct UI package access

### ESLint Configuration

- Next.js apps: Import from `@hex-ai/eslint-config/next-js`
- React libraries: Import from `@hex-ai/eslint-config/react-internal`
- All configs use flat ESLint config format (not legacy `.eslintrc`)

## External Dependencies & Integration

### Key Dependencies

- **Radix UI**: Accessible component primitives
- **React Hook Form + Zod**: Form validation
- **Framer Motion**: Animations
- **Lucide React & Tabler Icons**: Icon libraries

## Critical Conventions

### File Organization

- Use lowercase kebab-case for directories (`app/home`, `components/chat-sidebar.tsx`)
- Component files use PascalCase (`.tsx`)
- Utility/config files use kebab-case (`.ts`, `.js`)

### Component Patterns

- All UI components export named functions (not default)
- Use `"use client"` directive for client components (providers, interactive UI)
- Prefer composition over prop drilling (see Radix UI patterns in `packages/ui/src/components/*`)

### Turborepo Task Dependencies

- `build` depends on `^build` (builds dependencies first)
- `dev` is persistent and non-cached
- Turbo caches build outputs in `.next/**` (excluding cache directory)

## Common Tasks

### Adding a New UI Component

1. Create in `packages/ui/src/components/<component>.tsx`
2. Export via `packages/ui/package.json` exports field: `"./components/<component>": "./src/components/<component>.tsx"`
3. Import in web app: `import { Component } from "@hex-ai/ui/components/<component>"`

### Type Safety

- Run `pnpm typecheck` in `apps/web` to check types without building
- Shared types should live in package lib files, not component files
- Use Zod for runtime validation, TypeScript for compile-time safety
