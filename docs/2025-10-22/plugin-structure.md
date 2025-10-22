# Plugin Structure - Hybrid Approach

**Date:** October 22, 2025
**Status:** ✅ Approved

## Philosophy

**Core:** Universal tools everyone needs (meta-tools, quality, validation)
**Feature Plugins:** Install what your project needs (à la carte)

**Benefits:**

- Minimal core installation
- Clear feature separation
- Reduced overlap (shared utilities in core)
- TanStack gets dedicated focus (it's a massive ecosystem)
- Easy to mix and match per project

---

## Plugin Architecture

### 🔧 skill-tools (Core - Meta)

**Already exists!** Meta-tools for creating and managing Claude Code components.

**Contains:**

- skill-creator
- command-creator
- agent-creator
- hook-creator
- plugin-creator
- skill-validator

**Purpose:** Create new skills, commands, agents, hooks, plugins

**Install:** Default (recommended for everyone)

---

### ⚡ tanstack-tools (Feature Plugin)

**NEW!** TanStack ecosystem integration.

**Why separate?**

- TanStack is huge (Router, Query, Form, Table, Start)
- Fullstack (frontend + backend patterns)
- Deep integrations between packages
- Deserves focused expertise

**Skills:**

- tanstack-start-wizard (fullstack apps)
- tanstack-router-helper (file-based routing)
- tanstack-query-helper (server state)
- tanstack-form-helper (forms + validation)
- tanstack-table-helper (data tables)

**Agents:**

- tanstack-architect (cross-package patterns)

**Commands:**

- /setup-tanstack (interactive setup)
- /add-tanstack-route (route generation)

**Install when:**

- Using TanStack Start
- Using 2+ TanStack packages
- Building fullstack apps

---

### 🎨 frontend-tools (Feature Plugin)

**Existing!** React/UI development tools.

**Focus:** Components, design systems, styling

**Skills:**

- component-generator (Base UI components)
- design-system-orchestrator (theming, tokens, WCAG)
- radix-to-baseui-migrator (migration support)
- tailwind-helper (utility optimization)

**Agents:**

- component-designer (component architecture)

**Commands:**

- /scaffold-component (quick component creation)
- /migrate-radix-baseui (migration workflow)

**Hooks:**

- Component validation (naming, tests, a11y)
- Theme change validation (WCAG, ripple effects)

**Install when:**

- Building component libraries
- Design system work
- UI-heavy applications

---

### 🔌 api-tools (Feature Plugin)

**NEW!** Backend API development.

**Focus:** APIs, databases, authentication

**Skills:**

- hono-api-builder (Hono framework)
- drizzle-maestro (Drizzle ORM)
- better-auth-integrator (authentication)
- schema-validator (Zod/ArkType)
- elysia-api-builder (Elysia framework - future)

**Agents:**

- api-architect (API design from requirements)

**Commands:**

- /create-api (endpoint generation)
- /add-auth (auth setup)
- /generate-migration (Drizzle migrations)

**Hooks:**

- API route validation (OpenAPI, Zod, RPC)
- Schema change detection (migration prompts)

**Install when:**

- Building APIs
- Backend development
- Database-driven apps

---

### 🧪 testing-tools (Feature Plugin)

**Existing!** Testing automation and quality.

**Focus:** Test generation, coverage, E2E

**Skills:**

- vitest-component-tester (component tests in stories)
- storybook-automator (story generation)
- playwright-e2e-generator (E2E tests)
- coverage-analyzer (gap identification)

**Commands:**

- /generate-tests (quick test generation)

**Install when:**

- Prioritizing test coverage
- Component library testing
- E2E testing needs

---

### 📦 devops-tools (Feature Plugin)

**Existing!** DevOps and deployment.

**Focus:** CI/CD, monorepos, documentation

**Skills:**

- turborepo-architect (monorepo setup)
- pnpm-workspace-manager (workspace management)
- quality-enforcer (git hooks, linting)
- starlight-docs-generator (documentation sites)

**Commands:**

- /init-workspace (monorepo initialization)
- /setup-quality (quality tooling)

**Hooks:**

- Package manager enforcement (pnpm only)
- Auto-formatting (prettier, eslint)

**Install when:**

- Managing monorepos
- Setting up CI/CD
- Documentation sites

---

### 🔀 git-tools (Feature Plugin)

**Existing!** Git workflow automation.

**Focus:** Commits, PRs, changelogs

**Skills:**

- smart-commit (conventional commits + gitmoji)
- pr-description (auto-generate from commits)
- changelog-generator (semantic versioning)
- worktree-helper (parallel branches)

**Install when:**

- Standardizing commit messages
- Automating changelogs
- Managing complex git workflows

---

### 🏗️ typescript-tools (Feature Plugin)

**Existing!** TypeScript development.

**Focus:** Type checking, refactoring, validation

**Skills:**

- tsc-files-validation (CLI testing)
- refactor-imports (path aliases, cleanup)
- fix-types (auto-fix common errors)
- type-contract-enforcer (API ↔ frontend alignment)

**Install when:**

- TypeScript-heavy projects
- Monorepo with complex types
- Type safety critical

---

## Installation Matrix

### Use Case: TanStack Start Fullstack App

```bash
# Core (always)
/plugin install skill-tools

# Primary
/plugin install tanstack-tools  # Start, Router, Query, Form
/plugin install api-tools        # Hono, Drizzle, better-auth

# Optional
/plugin install frontend-tools   # If building component library
/plugin install testing-tools    # If test coverage is priority
/plugin install git-tools        # If team needs commit standards
```

---

### Use Case: Component Library

```bash
# Core
/plugin install skill-tools

# Primary
/plugin install frontend-tools   # Components, design system

# Optional
/plugin install testing-tools    # Storybook, Vitest
/plugin install devops-tools     # Docs with Starlight
```

---

### Use Case: API-Only Backend

```bash
# Core
/plugin install skill-tools

# Primary
/plugin install api-tools         # Hono, Drizzle, auth

# Optional
/plugin install typescript-tools  # Type safety
/plugin install testing-tools     # API testing
/plugin install devops-tools      # CI/CD
```

---

### Use Case: Monorepo with Multiple Apps

```bash
# Core
/plugin install skill-tools

# Primary
/plugin install devops-tools      # Turborepo, pnpm workspaces
/plugin install tanstack-tools    # Shared across apps
/plugin install api-tools         # Backend app
/plugin install frontend-tools    # Frontend app

# Optional
/plugin install testing-tools     # Cross-package testing
/plugin install typescript-tools  # Shared types
/plugin install git-tools         # Team workflow
```

---

## Core Shared Utilities

Since we're going hybrid, the **skill-tools** plugin should include shared utilities that feature plugins depend on:

### Shared in skill-tools:

**Validation:**

- File naming conventions
- TypeScript type checking helpers
- Schema validation utilities (used by api-tools AND frontend-tools)

**Patterns:**

- Explicit export generator (used by frontend-tools AND api-tools)
- Test file generator (used by testing-tools)
- OpenSpec integration (used by all)

**Utilities:**

- Package.json detection (Storybook? Vitest? TanStack?)
- Project structure analysis
- Dependency graph helpers

---

## Migration Path

### Current Structure → Hybrid Structure

**Already aligned:**

- ✅ skill-tools (core) - exists
- ✅ frontend-tools - exists
- ✅ testing-tools - exists
- ✅ git-tools - exists
- ✅ devops-tools - exists
- ✅ typescript-tools - exists

**New plugins to create:**

- 🆕 tanstack-tools
- 🆕 api-tools

**Migration:**

1. Create `tanstack-tools` plugin
2. Create `api-tools` plugin
3. Existing plugins stay as-is
4. Update marketplace.json with new plugins

---

## Tier 1 Skills by Plugin

### tanstack-tools

1. ⭐ tanstack-start-wizard (fullstack setup)
2. ⭐ tanstack-query-helper (server state patterns)
3. tanstack-router-helper (file-based routing)
4. tanstack-form-helper (forms + Zod)

### frontend-tools

1. ⭐ component-generator (Base UI + Storybook)
2. ⭐ design-system-orchestrator (theming + WCAG)
3. radix-to-baseui-migrator (migration)

### api-tools

1. ⭐ hono-api-builder (API development)
2. ⭐ drizzle-maestro (database)
3. ⭐ better-auth-integrator (authentication)
4. schema-validator (Zod/ArkType)

---

## Plugin Dependencies

Some plugins work better together:

**tanstack-tools** + **api-tools**

- TanStack Start server functions → Hono
- TanStack Query → Drizzle queries
- TanStack Form → Zod schemas

**frontend-tools** + **testing-tools**

- component-generator → storybook-automator
- design-system-orchestrator → vitest-component-tester

**api-tools** + **typescript-tools**

- Type contracts between API and frontend
- Shared types across stack

**All** + **git-tools**

- Commit standards regardless of tech stack

---

## Next Steps

1. ✅ Hybrid structure approved
2. ⏳ Create `tanstack-tools` plugin directory
3. ⏳ Create `api-tools` plugin directory
4. ⏳ Update marketplace.json with new plugins
5. ⏳ Create OpenSpec for `component-generator` (first skill)

---

**Status:** 📋 Structure finalized, ready to build
**First Skill:** component-generator (frontend-tools)
**Next Plugin:** tanstack-tools (after component-generator works)
