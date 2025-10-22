# super-claude

> Claude Code, supercharged. 🚀

A comprehensive collection of Claude Code plugins for TanStack Start, Base UI, Hono, and modern TypeScript development.

## ✨ What's Inside

- **Skills** - Reusable capabilities that auto-activate based on context
- **Agents** - Specialized Claude instances for specific tasks
- **Hooks** - Session lifecycle automation
- **Commands** - Custom slash commands for workflows

## 🚀 Quick Start

### Installation

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install plugins based on your stack (see "Choose Your Stack" below)
```

### Choose Your Stack

#### TanStack Start Fullstack App

```bash
/plugin install skill-tools       # Meta-tools for creating skills
/plugin install tanstack-tools    # TanStack Start, Router, Query, Form, Table
/plugin install api-tools         # Hono, Drizzle, better-auth
```

#### Component Library

```bash
/plugin install skill-tools       # Meta-tools
/plugin install frontend-tools    # Base UI components, design system, Tailwind
/plugin install testing-tools     # Storybook + Vitest component testing
```

#### Backend API

```bash
/plugin install skill-tools       # Meta-tools
/plugin install api-tools         # Hono, Drizzle, better-auth, Zod/ArkType
/plugin install typescript-tools  # Type safety and validation
```

## 📦 Available Plugins

### Core

#### skill-tools (Meta-Tools) ✅

Create and manage Claude Code enhancements:

- **skill-creator** - Generate new skills with proper structure and validation
- **command-creator** - Create custom slash commands
- **hook-creator** - Build event-driven hooks for automation
- **agent-creator** - Create specialized autonomous agents
- **plugin-creator** - Generate complete plugin packages
- **skill-validator** - Validate skills against Anthropic specifications

### Feature Plugins

#### tanstack-tools 🆕

TanStack ecosystem integration (Start, Router, Query, Form, Table):

- **tanstack-start-wizard** - Fullstack app setup with TanStack Start
- **tanstack-query-helper** - Server state management patterns
- **tanstack-form-helper** - Forms with Zod validation
- **tanstack-router-helper** - File-based routing and loaders
- **tanstack-table-helper** - Data tables with filtering and sorting

**Status:** 🚧 In Development

#### api-tools 🆕

Backend API development (Hono, Drizzle, better-auth):

- **hono-api-builder** - API endpoints with OpenAPI + RPC
- **drizzle-maestro** - Database schema, migrations, queries
- **better-auth-integrator** - Authentication providers setup
- **schema-validator** - Zod/ArkType schema management

**Status:** 🚧 In Development

#### frontend-tools

React/UI development with Base UI focus:

- **component-generator** - Base UI components with Storybook + Vitest
- **design-system-orchestrator** - Theming, design tokens, WCAG AAA validation
- **radix-to-baseui-migrator** - Migration helper for existing Radix UI code
- **tailwind-helper** - Utility class optimization

**Status:** 🚧 In Development

#### testing-tools

Testing automation (Storybook-based component tests):

- **vitest-component-tester** - Component tests in .stories.tsx files
- **storybook-automator** - Story generation with embedded tests
- **playwright-e2e-generator** - End-to-end testing workflows

**Status:** 🚧 In Development

#### devops-tools

DevOps and deployment automation:

- **turborepo-architect** - Monorepo setup and optimization
- **pnpm-workspace-manager** - Workspace management
- **quality-enforcer** - Git hooks, linting, formatting

**Status:** 🚧 Planned

#### git-tools

Git workflow automation:

- **smart-commit** - Conventional commits with gitmoji
- **pr-description** - Auto-generate PR descriptions
- **changelog-generator** - Semantic versioning changelogs

**Status:** 🚧 Planned

#### typescript-tools

TypeScript development tools:

- **type-safety-enforcer** - API ↔ frontend type contracts
- **refactor-imports** - Import organization and cleanup

**Status:** 🚧 Planned

## 🏗️ Project Structure

```sh
super-claude/
├── plugins/               # Plugin packages
│   ├── skill-tools/      # Meta-tools (ready)
│   ├── tanstack-tools/   # TanStack ecosystem (in dev)
│   ├── api-tools/        # Backend development (in dev)
│   ├── frontend-tools/   # React/UI (in dev)
│   ├── testing-tools/    # Testing automation (in dev)
│   ├── devops-tools/     # DevOps (planned)
│   ├── git-tools/        # Git workflows (planned)
│   └── typescript-tools/ # TypeScript (planned)
├── .claude-plugin/       # Marketplace configuration
└── docs/                 # Brainstorm sessions and decisions
```

## 💡 Tech Stack Focus

This plugin collection is optimized for:

**Frontend:**

- React + Vite
- TanStack Suite (Start, Router, Query, Form, Table)
- Base UI components (migrating from Radix UI)
- Tailwind CSS
- Storybook + Vitest

**Backend:**

- Hono and Elysia frameworks
- Drizzle ORM (PostgreSQL, Turso, SQLite)
- better-auth for authentication
- OpenAPI + RPC patterns

**Fullstack:**

- TanStack Start (preferred over monorepos)
- Type-safe end-to-end with Zod/ArkType

**Quality:**

- Vitest (tests in .stories.tsx for components)
- Playwright for E2E
- ESLint, Prettier, lefthook/husky
- WCAG AAA accessibility

## 🎯 Creating Skills

Use the skill-creator from skill-tools plugin:

```bash
# Install skill-tools
/plugin install skill-tools

# In Claude Code, ask:
"Create a skill for [purpose]"

# The skill-creator will guide you through:
# - Skill structure and YAML frontmatter
# - When to use and activation triggers
# - Best practices and validation
```

See `docs/2025-10-22/brainstorm.md` for skill ideas.

## 🔧 Component File Structure

### UI Components (with Storybook)

```sh
src/components/ui/button/
├── button.tsx           # Component implementation
├── button.stories.tsx   # Storybook + Vitest tests combined
└── index.ts             # Explicit exports
```

**Explicit exports (no barrel exports):**

```typescript
// ✅ Good
export { Button } from './button';
export type { ButtonProps } from './button';

// ❌ Avoid
export * from './button'; // Bad for tree-shaking
```

### Domain Logic

```sh
src/utils/formatters/
├── currency.ts       # Implementation
└── currency.test.ts  # Separate test file
```

## 🎨 Base UI vs Radix UI

**New components:** Generate with Base UI

```bash
pnpm add @base-ui-components/react  # Single package (preferred)
```

**Existing Radix code:** Migration support available

- `radix-to-baseui-migrator` skill helps with migration
- Prefer single `radix-ui` package over individual packages
- Automatic suggestions for Base UI alternatives

## 📄 License

MIT © [Jace Babin](https://github.com/jbabin91)

## 🙏 Acknowledgments

Inspired by:

- [obra/superpowers](https://github.com/obra/superpowers) - Battle-tested TDD workflows
- [anthropics/skills](https://github.com/anthropics/skills) - Official skill examples
- [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) - Universal executor pattern

---

**Status**: 🚧 Active Development | **Version**: 0.3.0
