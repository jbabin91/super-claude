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

#### Component Library Author

```bash
/plugin install workflow        # OpenSpec workflow, session automation
# Additional plugins coming soon: design-system, testing
```

#### Frontend App Developer

```bash
/plugin install workflow        # Development workflow enhancements
# Additional plugins coming soon: frontend, tanstack, design-system
```

#### Plugin Creator / Power User

```bash
/plugin install meta           # Create custom skills, commands, agents
/plugin install workflow       # OpenSpec, auto-activation, session hooks
```

> **Note:** Design-system, TanStack, API, Database, and Auth plugins are planned but not yet fully implemented. See Available Plugins below for current status.

## 📦 Available Plugins

### ✅ Ready to Use

#### meta

**Create custom skills, commands, agents, hooks, and plugins**

For plugin creators and power users extending Claude Code with custom capabilities.

**Features:**

- skill-creator - Generate new skills with proper structure
- command-creator - Create custom slash commands
- agent-creator - Build specialized autonomous agents
- hook-creator - Event-driven automation
- plugin-creator - Generate complete plugin packages
- skill-validator - Validate against Anthropic specs

**Install:** `/plugin install meta`

#### workflow

**Development workflow enhancements with OpenSpec and skill auto-activation**

Enhance your development workflow with spec-driven proposals, session automation, and intelligent skill suggestions.

**Features:**

- OpenSpec proposal management - Spec-driven development workflow
- Skill auto-activation system - Context-aware skill suggestions
- Session automation hooks - Startup checklist, type checking, commit guards
- Project configuration - Unified configuration system for all plugins

**Install:** `/plugin install workflow`

### 🚧 In Development (Scaffolding Only)

#### design-system

Component libraries with Base UI, shadcn/ui, design tokens, WCAG AAA accessibility, and Storybook integration.

#### testing

Unit, integration, and E2E testing with Vitest and Playwright.

#### typescript

TypeScript type checking, refactoring, and import management.

#### git

Git workflow automation with smart commits, gitmoji, PR descriptions.

#### devops

CI/CD pipelines, GitHub Actions, Docker, and deployment automation.

### 📋 Planned

The following plugins are planned but not yet started:

- **frontend** - App architecture, performance, build optimization
- **tanstack** - TanStack Start, Router, Query, Form, Table
- **api** - Hono and Elysia API development
- **database** - Drizzle ORM for PostgreSQL, SQLite, Turso
- **auth** - better-auth integration
- **react** - React patterns, hooks, state management
- **storybook** - Story generation and documentation

## 🏗️ Project Structure

```sh
super-claude/
├── plugins/            # Plugin packages
│   ├── meta/          # Meta-tools (ready)
│   ├── workflow/      # Development workflow (ready)
│   ├── design-system/ # Component libraries (in dev)
│   ├── testing/       # Testing automation (in dev)
│   ├── typescript/    # TypeScript tools (in dev)
│   ├── git/           # Git workflows (in dev)
│   └── devops/        # DevOps (in dev)
├── .claude-plugin/    # Marketplace configuration
└── docs/              # Documentation and guides
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

Use the skill-creator from meta plugin:

```bash
# Install meta (for plugin creators)
/plugin install meta

# In Claude Code, ask:
"Create a skill for [purpose]"

# The skill-creator will guide you through:
# - Skill structure and YAML frontmatter
# - When to use and activation triggers
# - Best practices and validation
```

## ✅ Schema Validation

All plugin manifests and skill frontmatter are automatically validated to prevent runtime errors.

### Quick Commands

```bash
# Validate all schemas (fast, ~50ms)
bun run validate

# Validate only git-staged files
bun run validate:changed

# Show detailed validation output
bun run validate:verbose
```

### Automated Git Hooks

**Pre-commit** (runs automatically):

- Validates staged plugin.json, marketplace.json, hooks.json, SKILL.md files
- Catches invalid schemas before commit
- Fast execution (~50ms for typical commits)

**Pre-push** (runs automatically):

- Enforces version bumps when plugin code changes
- Ensures marketplace.json versions match plugin.json

### Bypass Hooks (when needed)

```bash
# Skip all pre-commit hooks (use sparingly)
git commit --no-verify

# Skip pre-push hooks
git push --no-verify
```

### Common Issues

**"hooks field must be an object or string path, not an array"**

Hooks cannot be a flat array. Use either:

```json
// Option 1: External file
{ "hooks": "hooks.json" }

// Option 2: Nested object
{
  "hooks": {
    "hooks": {
      "SessionStart": [
        {
          "hooks": [
            { "type": "command", "command": "path/to/hook.ts" }
          ]
        }
      ]
    }
  }
}
```

**"No frontmatter found in SKILL.md"**

Skills require YAML frontmatter between `---` delimiters:

```markdown
---
name: skill-name
version: 1.0.0
description: What the skill does
---

# Skill content...
```

See [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks.md) for complete documentation.

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

**Status**: 🚧 Active Development | **Version**: 0.5.0
