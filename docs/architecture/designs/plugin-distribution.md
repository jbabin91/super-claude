# Plugin Distribution Design

This document defines the structure and distribution strategy for super-claude plugins in the Claude Code marketplace.

## Overview

super-claude is a marketplace of modular plugins for Claude Code, focusing on:

- **TanStack ecosystem** (Start, Router, Query, Form, Table)
- **Base UI components** and design systems
- **Backend development** (Hono, Drizzle, better-auth)
- **Quality tooling** (testing, TypeScript, Git workflows)
- **Meta-tools** (plugin/skill creation, validation)

## Architecture Principles

### 1. **Modularity**

Each plugin is independently installable and usable:

```bash
/plugin install meta   # Core meta-tools
/plugin install tanstack       # TanStack ecosystem
/plugin install api            # Hono APIs
```

### 2. **Minimal Dependencies**

Plugins should:

- **Avoid runtime dependencies** - Users shouldn't need to install npm packages to use skills
- **Use Bun for hooks** - TypeScript hooks execute with Bun shebang (`#!/usr/bin/env bun`)
- **Isolate type definitions** - Type checking uses isolated `.claude/` workspace

### 3. **Progressive Enhancement**

Plugins build on each other:

- **meta** - Foundation for creating/validating skills (install first)
- **Feature plugins** - Extend Claude's capabilities for specific domains
- **Auto-activation** - Skills activate based on context without manual invocation

## Directory Structure

### Root Marketplace Structure

```txt
super-claude/
├── .claude-plugin/
│   ├── marketplace.json          # Marketplace manifest
│   ├── marketplace.schema.json   # Marketplace JSON schema
│   └── plugin.schema.json        # Plugin JSON schema
├── plugins/
│   ├── meta/             # Meta-tools (foundation)
│   ├── tanstack/                 # TanStack ecosystem
│   ├── api/                      # Backend APIs
│   ├── database/                 # Drizzle ORM
│   ├── auth/                     # better-auth
│   ├── components/               # Base UI components
│   ├── react/                    # React patterns
│   ├── storybook/                # Storybook stories
│   ├── testing/                  # Testing tools
│   ├── typescript/               # TypeScript utilities
│   ├── git/                      # Git workflows
│   ├── devops/                   # CI/CD pipelines
│   ├── monorepo/                 # Turborepo/pnpm
│   └── packages/                 # npm publishing
├── docs/                         # Documentation
├── .gitignore                    # Root ignore patterns
├── package.json                  # Dev dependencies (Bun)
├── tsconfig.json                 # Root TypeScript config
└── eslint.config.js              # Code quality rules
```

### Individual Plugin Structure

Each plugin follows this standard structure:

```txt
plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json               # Plugin manifest (required)
├── skills/
│   ├── {skill-name}/
│   │   └── SKILL.md              # Skill definition
│   └── skill-rules.json          # Auto-activation rules
├── agents/
│   └── {name}-agent.md           # Agent definitions
├── commands/
│   └── {command}.md              # Slash commands
├── hooks/
│   └── {hook-name}.ts            # Event hooks (Bun)
├── templates/
│   └── *.template.json           # User-facing templates
├── types/
│   └── *.d.ts                    # TypeScript definitions
├── README.md                     # Plugin documentation
└── CHANGELOG.md                  # Version history
```

**Required Files:**

- `.claude-plugin/plugin.json` - Plugin manifest
- `README.md` - User-facing documentation

**Optional Directories:**

- `skills/` - Claude Code skills
- `agents/` - Specialized agents
- `commands/` - Slash commands
- `hooks/` - Event handlers
- `templates/` - Configuration templates
- `types/` - TypeScript definitions

## Plugin Manifest (plugin.json)

Each plugin must have a `.claude-plugin/plugin.json` file:

```json
{
  "$schema": "https://raw.githubusercontent.com/jbabin91/super-claude/main/.claude-plugin/plugin.schema.json",
  "name": "plugin-name",
  "version": "0.1.0",
  "description": "Brief description of plugin capabilities",
  "author": {
    "name": "Jace Babin",
    "email": "jbabin91@gmail.com",
    "url": "https://github.com/jbabin91"
  },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "commands": "./commands",
  "agents": "./agents",
  "hooks": "./hooks/hooks.json"
}
```

**Required Fields:**

- `name` - Unique identifier (kebab-case)
- `version` - Semantic versioning (e.g., `0.1.0`)
- `description` - Brief plugin purpose
- `author` - Author information
- `license` - License identifier

**Optional Fields:**

- `keywords` - Searchability and discovery
- `commands` - Custom command paths
- `agents` - Custom agent paths
- `hooks` - Hook configuration
- `mcpServers` - MCP server integration

## Marketplace Manifest (marketplace.json)

The root marketplace configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/jbabin91/super-claude/main/.claude-plugin/marketplace.schema.json",
  "name": "super-claude",
  "owner": {
    "name": "Jace Babin",
    "email": "jbabin91@gmail.com",
    "url": "https://github.com/jbabin91"
  },
  "metadata": {
    "version": "0.3.0",
    "description": "Comprehensive marketplace of Claude Code plugins",
    "repository": "https://github.com/jbabin91/super-claude",
    "homepage": "https://github.com/jbabin91/super-claude",
    "license": "MIT"
  },
  "plugins": [
    {
      "name": "meta",
      "source": "./plugins/meta",
      "description": "Meta-tools for creating and managing skills",
      "version": "0.1.0",
      "category": "meta",
      "keywords": ["skills", "generator", "validation"]
    }
  ]
}
```

## Installation Workflow

### User Installation

Users install plugins from the marketplace:

```bash
# Add the marketplace (one-time)
/plugin marketplace add jbabin91/super-claude

# Install plugins (modular)
/plugin install meta   # Foundation
/plugin install tanstack       # TanStack support
/plugin install api            # API development
```

### Behind the Scenes

When a user installs a plugin, Claude Code:

1. **Copies plugin files** to `.claude/skills/{namespace}/{plugin-name}/`
2. **Registers commands** from `commands/` directory
3. **Registers agents** from `agents/` directory
4. **Installs hooks** from `hooks/` directory
5. **Loads skill-rules.json** for auto-activation

### Project Integration

After installation, the user's project has:

```txt
.claude/
├── skills/
│   ├── claude/
│   │   └── meta/        # From marketplace
│   ├── tanstack/
│   │   └── tanstack/            # From marketplace
│   └── skill-rules.json         # Project overrides (optional)
├── commands/
│   ├── openspec/                # OpenSpec commands
│   └── configure-activation.md  # From meta
├── hooks/
│   └── skill-activation-prompt.ts
├── tsconfig.json                # Isolated TypeScript config
├── package.json                 # Type definitions only
└── node_modules/                # @types/bun
```

## Auto-Activation System

### Per-Plugin Rules

Each plugin defines activation rules in `skills/skill-rules.json`:

```json
{
  "plugin": {
    "name": "meta",
    "version": "1.0.0",
    "namespace": "claude"
  },
  "skills": {
    "skill-creator": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["create skill", "new skill"],
        "intentPatterns": ["(create|add).*?skill"]
      }
    }
  }
}
```

### Runtime Aggregation

The `skill-activation-prompt.ts` hook:

1. **Discovers** all `skill-rules.json` from installed plugins
2. **Merges** with project overrides in `.claude/skills/skill-rules.json`
3. **Matches** user prompt against keywords/patterns
4. **Suggests** relevant skills before Claude responds

### Project Overrides

Users can customize activation in `.claude/skills/skill-rules.json`:

```json
{
  "version": "1.0",
  "overrides": {
    "claude/skill-creator": {
      "priority": "critical",
      "promptTriggers": {
        "keywords": ["create skill", "scaffold skill"]
      }
    }
  },
  "disabled": ["claude/old-skill"],
  "global": {
    "maxSkillsPerPrompt": 3,
    "priorityThreshold": "high"
  }
}
```

## Dependencies and Isolation

### TypeScript Hooks

Hooks use Bun with isolated type definitions:

**Shebang for Execution:**

```typescript
#!/usr/bin/env bun

// Hook executes with Bun, no npm install needed
```

**Type Definitions in .claude/:**

```json
// .claude/package.json
{
  "name": "claude-workspace",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

```json
// .claude/tsconfig.json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "strict": true,
    "types": ["bun", "node"]
  }
}
```

**Benefits:**

- ✅ TypeScript works in development
- ✅ No runtime dependencies for users
- ✅ Isolated from main project
- ✅ Single `bun install` in `.claude/`

### Runtime Requirements

**User Requirements:**

- Bun installed globally (for hook execution)
- No npm packages required in their project

**Plugin Requirements:**

- TypeScript source for hooks
- Shebang for Bun execution
- Self-contained logic (no external deps)

## Versioning Strategy

### Semantic Versioning

All plugins follow semver:

- **Major** (X.0.0) - Breaking changes
- **Minor** (0.X.0) - New features, backward compatible
- **Patch** (0.0.X) - Bug fixes

### Marketplace Version

The marketplace itself has a version:

```json
{
  "metadata": {
    "version": "0.3.0"
  }
}
```

This increments when:

- **Major** - Breaking changes to plugin structure
- **Minor** - New plugins added
- **Patch** - Bug fixes to existing plugins

### Plugin Independence

Each plugin versions independently:

- `meta: 0.2.0`
- `tanstack: 0.1.0`
- `api: 0.1.0`

Users can mix and match versions.

## Publishing Process

### 1. Update Plugin

Modify plugin files:

- Add/update skills, commands, hooks
- Update `plugin.json` version
- Update `CHANGELOG.md`

### 2. Update Marketplace

Edit `.claude-plugin/marketplace.json`:

```json
{
  "plugins": [
    {
      "name": "meta",
      "version": "0.2.0", // Increment
      "description": "Updated description"
    }
  ]
}
```

### 3. Quality Checks

Run linting and formatting:

```bash
bun run lint       # ESLint
bun run lint:md    # Markdown
bun run typecheck  # TypeScript
bun run format     # Prettier
```

### 4. Commit and Tag

```bash
git add .
git commit -m "feat(meta): add new skill-creator features"
git tag v0.2.0
git push origin main --tags
```

### 5. GitHub Release

Create a GitHub release:

- Tag: `v0.2.0`
- Title: `super-claude v0.2.0`
- Description: Changelog from `CHANGELOG.md`

## Distribution Checklist

### Required for Distribution

- [x] `.claude-plugin/plugin.json` in each plugin
- [x] `README.md` in each plugin
- [x] `skill-rules.json` for auto-activation
- [ ] `CHANGELOG.md` for version history
- [ ] Updated marketplace.json versions
- [ ] All quality checks passing
- [ ] GitHub release created

### Recommended

- [ ] Example projects showing plugin usage
- [ ] Video walkthrough of installation
- [ ] Troubleshooting guide
- [ ] Migration guide for breaking changes

## Plugin Categories

### Meta (Foundation)

- **meta** - Skill/command/agent creation, validation, auto-activation

### Fullstack

- **tanstack** - TanStack Start, Router, Query, Form, Table

### Frontend

- **components** - Base UI components, design systems, WCAG AAA
- **react** - React patterns, hooks, context, state
- **storybook** - Story generation, component docs

### Backend

- **api** - Hono and Elysia API development
- **database** - Drizzle ORM for PostgreSQL, SQLite, Turso
- **auth** - better-auth integration

### Quality

- **testing** - Vitest, Playwright, E2E testing
- **typescript** - Type checking, refactoring, imports

### Workflow

- **git** - Smart commits, PR descriptions, changelogs

### DevOps

- **devops** - GitHub Actions, Docker, CI/CD
- **monorepo** - Turborepo, pnpm workspaces

### Publishing

- **packages** - npm library development, versioning

## Future Enhancements

### Plugin Dependencies

Add `dependencies` field to `plugin.json`:

```json
{
  "name": "tanstack",
  "dependencies": {
    "meta": ">=0.1.0"
  }
}
```

Claude Code would auto-install dependent plugins.

### Plugin Configuration

Support `.claude/{plugin-name}.config.json` for user customization:

```json
{
  "meta": {
    "defaultSkillPriority": "high",
    "autoActivation": true
  }
}
```

### Multi-Namespace Support

Allow plugins from different authors:

```txt
.claude/skills/
├── jbabin91/
│   └── meta/
├── anthropic/
│   └── official-tools/
└── community/
    └── custom-tools/
```

## Troubleshooting

### Plugin Not Activating

**Check installation:**

```bash
ls -la .claude/skills/*/plugin-name/
```

**Check skill-rules.json exists:**

```bash
cat .claude/skills/namespace/plugin-name/skills/skill-rules.json
```

### Hooks Not Running

**Verify Bun installed:**

```bash
bun --version
```

**Check hook is executable:**

```bash
ls -la .claude/hooks/*.ts
chmod +x .claude/hooks/*.ts
```

### TypeScript Errors in Hooks

**Install types in .claude/:**

```bash
cd .claude
bun install
```

**Run typecheck:**

```bash
bun run typecheck
```

## References

- **Naming Conventions**: `plugins/meta/NAMING_CONVENTIONS.md`
- **Skill Activation Guide**: `docs/SKILL_ACTIVATION_GUIDE.md`
- **OpenSpec Workflow**: `docs/OPENSPEC_WORKFLOW_GUIDE.md`
- **Plugin Schema**: `.claude-plugin/plugin.schema.json`
- **Marketplace Schema**: `.claude-plugin/marketplace.schema.json`
