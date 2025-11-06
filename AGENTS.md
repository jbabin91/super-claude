# AGENTS.md

This file provides guidance to AI assistants working with the super-claude repository.

## 📋 Project Context

**Project Name:** super-claude
**Purpose:** Comprehensive collection of Claude Code plugins for TanStack Start, Base UI, Hono, and modern TypeScript development
**Focus:** TanStack ecosystem, Base UI components, Hono APIs, Drizzle ORM, better-auth, testing automation
**Status:** 🚧 Active Development - meta and design-system plugins ready, building additional feature plugins

## 🎯 Project Mission

Create a curated, well-documented collection of Claude Code enhancements that:

- Automate repetitive development workflows
- Enforce best practices and quality standards
- Support both personal and work projects (with privacy)
- Provide reusable patterns for the TanStack/Base UI/Hono ecosystem

## 🏗️ Architecture

### Naming Conventions

**ALWAYS follow these naming conventions when creating plugins, skills, agents, commands, and hooks:**

#### Plugins

- **Format:** `{category}` or `{category}-{purpose}` (no `-tools` suffix)
- **Examples:** `tanstack`, `api`, `database`, `auth`, `design-system`, `testing`, `git`, `typescript`
- **Special case:** `meta` (meta-tools for creating skills, commands, agents, hooks, plugins)

#### Skills

- **Format:** Descriptive kebab-case name (NO `-skill` suffix)
- **Location:** `plugins/{plugin}/skills/{name}/SKILL.md`
- **Examples:**
  - `hono.md` (not `hono-skill.md`)
  - `api.md` (not `api-skill.md`)
  - `component-generator.md` (not `component-generator-skill.md`)
  - `drizzle-maestro.md` (not `drizzle-maestro-skill.md`)

#### Agents

- **Format:** Descriptive kebab-case name (NO `-agent` suffix)
- **Location:** `plugins/{plugin}/agents/{name}.md`
- **Examples:**
  - `hono.md` (not `hono-agent.md`)
  - `api.md` (not `api-agent.md`)
  - `component.md` (not `component-agent.md`)

#### Commands

- **Format:** Verb phrases in kebab-case (NO suffix)
- **Location:** `plugins/{plugin}/commands/{name}.md`
- **Examples:**
  - `create-hono-api.md` (not `create-hono-api-command.md`)
  - `generate-component.md`
  - `setup-auth.md`

#### Hooks

- **Format:** Event-based or lifecycle names (NO suffix)
- **Location:** `plugins/{plugin}/hooks/{name}.md`
- **Examples:**
  - `pre-commit.md` (not `pre-commit-hook.md`)
  - `post-deploy.md`
  - `on-error.md`

**Rationale:** The directory structure already indicates the type (`skills/`, `agents/`, `commands/`, `hooks/`), so adding redundant suffixes like `-skill` or `-command` is unnecessary and verbose.

### Directory Structure

```sh
super-claude/
├── plugins/            # Plugin packages
│   ├── meta/          # Meta-tools (ready)
│   ├── design-system/ # Component libraries (ready)
│   ├── testing/       # Testing automation (in dev)
│   ├── typescript/    # TypeScript tools (in dev)
│   ├── git/           # Git workflows (in dev)
│   └── devops/        # DevOps (in dev)
├── .claude-plugin/    # Marketplace configuration
└── docs/              # Brainstorm sessions and decisions
```

### Key Files

- **openspec/changes/** - Plugin proposals with detailed skill plans
- **openspec/project.md** - Tech stack and project conventions
- **.claude-plugin/marketplace.json** - Plugin marketplace manifest
- **docs/PLUGIN_DISTRIBUTION_DESIGN.md** - Plugin architecture reference

### Auto-Activation System

**Status:** ✅ Implemented and ready to use

Skills automatically activate based on prompt keywords and intent patterns. No manual invocation required.

**Architecture:** Per-plugin `skill-rules.json` + project overrides + UserPromptSubmit hook (<50ms execution)

**For complete guide, see [docs/guides/skill-activation.md](docs/guides/skill-activation.md)**

**Quick start:**

```bash
# Generate project overrides template
/configure-activation
```

## 🔒 Privacy & Security

### Public Content

- `plugins/*` - Generic, reusable plugins with skills
- Documentation and architectural guides
- Marketplace configuration

### Project-Specific Skills

For project-specific or work-related skills:

- Install plugins from marketplace: `/plugin install <plugin-name>`
- Create project-specific skills in: `<project>/.claude/skills/`

## 🎨 Development Workflow

### Creating New Skills

**ALWAYS follow RED-GREEN-REFACTOR:**

1. **RED Phase**
   - Run scenarios WITHOUT the skill
   - Document failures and agent rationalizations
   - Identify specific problems to solve

2. **GREEN Phase**
   - Write minimal skill addressing failures
   - Use skill-creator from meta plugin
   - Test that Claude complies with skill

3. **REFACTOR Phase**
   - Identify new rationalizations
   - Add explicit counters and guards
   - Re-test until bulletproof

**Never deploy untested skills!**

### Skill File Format

**Required YAML frontmatter:**

```yaml
---
name: skill-identifier # kebab-case
version: 1.0.0 # semantic versioning
description: |
  What it does + when to use + activation triggers
category: workflow-automation
tags: [tag1, tag2]
model: sonnet # sonnet | haiku | opus
requires:
  tools: [git, npm] # External dependencies
triggers:
  keywords: [keyword1, keyword2]
  patterns: ['pattern1']
---
```

### Progressive Disclosure

Keep skills token-efficient:

- **SKILL.md**: < 500 lines (core instructions)
- **API_REFERENCE.md**: Advanced topics (loaded on demand)
- **Target**: < 500 words for frequently-loaded skills

### Universal Executor Pattern

For skills that generate and execute code (testing, CLI validation):

```javascript
// run.js - Universal executor
export async function execute(code, context) {
  // 1. Create temp file with proper module context
  // 2. Set up environment with dependencies
  // 3. Execute with proper module resolution
  // 4. Parse results
  // 5. Clean up without race conditions
}
```

See `RESEARCH_FINDINGS.md` → "playwright-skill" section for complete pattern.

### Markdown Formatting Standards

**ALWAYS follow these markdownlint rules to avoid warnings.**

**For complete rules and examples, see [docs/standards/markdown.md](docs/standards/markdown.md)**

**Quick reference:**

- ✅ Code blocks MUST have language identifier (MD040)
- ✅ Blank line BEFORE lists (MD032)
- ✅ Blank lines AROUND headings (MD022/MD023)
- ✅ Use `sh` for terminal/CLI, `txt` when unsure

**Before committing:**

```sh
bun run format   # Format all files
bun run lint:md  # Lint markdown
bun run lint     # Lint TypeScript/JavaScript
```

## 📚 Documentation

### Quick Navigation

**For comprehensive documentation, see [docs/README.md](docs/README.md)**

**Essential Guides:**

- [Skill Activation Guide](docs/guides/skill-activation.md) - Auto-activation system
- [OpenSpec Workflow](docs/workflows/openspec.md) - Spec-driven development
- [GitHub Flow](docs/workflows/git/github-flow.md) - Branching strategy and pull requests
- [Commit Conventions](docs/workflows/git/commit-conventions.md) - Conventional commits + gitmoji
- [Development Commands](docs/workflows/development.md) - Setup and common tasks
- [Markdown Standards](docs/standards/markdown.md) - Formatting rules
- [Architecture Decisions](docs/architecture/INDEX.md) - ADR catalog

### Official Claude Code Documentation

**Documentation Index:** <https://code.claude.com/docs/llms.txt> (multilingual)

**Core Features:**

- [Settings](https://code.claude.com/docs/en/settings.md) - Global and project-level configuration
- [Interactive Mode](https://code.claude.com/docs/en/interactive-mode.md) - Keyboard shortcuts and interactive features
- [Slash Commands](https://code.claude.com/docs/en/slash-commands.md) - Control Claude's behavior
- [Memory](https://code.claude.com/docs/en/memory.md) - Manage memory across sessions
- [Checkpointing](https://code.claude.com/docs/en/checkpointing.md) - Track and rewind edits

**Extension System:**

- [Plugins](https://code.claude.com/docs/en/plugins.md) - Plugin system overview
- [Plugins Reference](https://code.claude.com/docs/en/plugins-reference.md) - Technical reference and schemas
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md) - Create and manage marketplaces
- [Skills](https://code.claude.com/docs/en/skills.md) - Create and manage Skills
- [Subagents](https://code.claude.com/docs/en/sub-agents.md) - Specialized AI subagents
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide.md) - Get started with hooks
- [Hooks Reference](https://code.claude.com/docs/en/hooks.md) - Hooks implementation reference

**Integrations:**

- [MCP (Model Context Protocol)](https://code.claude.com/docs/en/mcp.md) - Connect to tools via MCP
- [Headless Mode](https://code.claude.com/docs/en/headless.md) - Run programmatically without UI

### Before Starting Work

**ALWAYS read these first:**

1. **openspec/changes/** - Plugin proposals with skill details
2. **openspec/project.md** - Tech stack and project conventions
3. **docs/architecture/INDEX.md** - Strategic architecture decisions
4. **Relevant category in plugins/** - See existing patterns

### Skill Development References

- **skill-creator** (meta plugin) - Generate new skills with proper structure
- **Universal executor pattern** - For test frameworks, CLI testing
- **Progressive disclosure** - SKILL.md → API_REFERENCE.md for token efficiency

### Top Patterns to Use

1. **Progressive Disclosure** - SKILL.md → API_REFERENCE.md (~2.5x token savings)
2. **Universal Executor** - For test frameworks, CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology
4. **Validation Framework** - Multi-layer validation (parameter, data, temporal, completeness)
5. **Context-Aware Activation** - Auto-trigger via keywords/patterns

## 🎯 Implementation Priorities

**For detailed skill plans and priorities, see [openspec/changes/](openspec/changes/)**

### Current Focus

**Ready:**

- ✅ **meta** - skill-creator, command-creator, skill auto-activation
- ✅ **design-system** - component-generator, theme orchestrator, Radix→Base UI migration

**In Development:**

- 🚧 **testing** - Vitest component tests, Playwright E2E, Storybook automation
- 🚧 **typescript** - Type safety, import refactoring
- 🚧 **git** - Smart commits, PR descriptions, changelog generation
- 🚧 **devops** - GitHub Actions, Docker, CI/CD

**Planned:**

- 📋 **tanstack** - TanStack Start wizard, Query helper, Router patterns
- 📋 **api** - Hono API builder, Drizzle maestro, better-auth integration

See individual OpenSpec proposals in `openspec/changes/` for complete feature breakdowns.

## 🚫 Anti-Patterns to Avoid

- ❌ Narrative examples tied to specific sessions
- ❌ Generic labels (helper1, step2, utils)
- ❌ TODOs or placeholders in skills
- ❌ Untested skills
- ❌ Multi-language dilution (focus on TS/JS/React)

## 🎓 Key Development Principles

### Skill Quality Standards

1. **Progressive disclosure** - SKILL.md < 500 lines, advanced topics in API_REFERENCE.md
2. **Universal executor pattern** - For test frameworks, CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology
4. **Context-aware activation** - Auto-trigger via keywords/patterns
5. **Token efficiency** - Keep frequently-loaded skills under 500 words

### Testing Principles

**Philosophy:** Testing first, but Storybook IS test infrastructure for components.

**Component Testing:**

- **Stories-based testing** - Tests live in `.stories.tsx` files (not separate test files)
- **Storybook + Vitest integration** - Stories include embedded Vitest tests
- **WCAG AAA accessibility validation** - Automated accessibility checks in stories
- **Visual + functional testing** - Stories serve dual purpose (documentation + tests)

**Domain Logic Testing:**

- **Separate test files** - Functions/utilities get `.test.ts` files
- **Priority order** - Unit → Integration → E2E
- **Pure functions preferred** - Easier to test, better reliability

**File Structure Examples:**

**UI Components (use stories):**

```txt
src/components/ui/button/
├── button.tsx              # Component implementation
├── button.stories.tsx      # Storybook + Vitest tests combined
└── index.ts                # Explicit exports only
```

**Utility Functions (use separate tests):**

```txt
src/utils/formatters/
├── currency.ts             # Function implementation
└── currency.test.ts        # Vitest unit tests
```

**File Generation Rules:**

| Type             | Files to Generate                    | Testing Approach                              |
| ---------------- | ------------------------------------ | --------------------------------------------- |
| UI Component     | `.tsx` + `.stories.tsx` + `index.ts` | Stories with embedded Vitest tests            |
| Function/Utility | `.ts` + `.test.ts`                   | Separate Vitest test file                     |
| Hook             | `.ts` + `.test.ts`                   | Separate test file with React Testing Library |
| API Endpoint     | `.ts` + `.test.ts`                   | Separate integration test file                |

**Rationale:**

- **Component library projects** benefit from Storybook as living documentation + test infrastructure
- **Stories as tests** reduces duplication and ensures visual examples stay tested
- **Separate test files** for domain logic keeps business logic tests focused
- **No barrel exports** (use explicit exports in `index.ts`) for better tree-shaking

### Code Organization

**Explicit Exports (No Barrel Exports):**

```typescript
// ✅ Good
export { Button } from './button';
export type { ButtonProps } from './button';

// ❌ Avoid
export * from './button';
```

### Base UI vs Radix UI

**New Components:**

- Generate with Base UI only (`@base-ui-components/react`)
- Single package installation (not individual component packages)
- Focus on Base UI patterns and APIs

**Existing Radix UI Code:**

- Understand Radix patterns for migration support
- Prefer single `radix-ui` package over individual packages
- Suggest Base UI alternatives when asked about Radix
- Provide migration paths via `radix-to-baseui-migrator` skill

**Example:**

```tsx
// Understand this (Radix UI)
import * as Dialog from '@radix-ui/react-dialog';

// Generate this instead (Base UI)
import { Dialog } from '@base-ui-components/react';
```

## 💡 Tech Stack Focus

**For complete tech stack details and rationale, see [openspec/project.md](openspec/project.md) and [docs/architecture/INDEX.md](docs/architecture/INDEX.md)**

**Quick reference:**

- **Frontend:** React + TanStack Suite + Base UI + Tailwind + Vitest
- **Backend:** Hono + Drizzle ORM (PostgreSQL/Turso/SQLite) + better-auth
- **Fullstack:** TanStack Start (preferred)
- **Quality:** WCAG AAA accessibility, tests in .stories.tsx, Playwright E2E

## 🔧 Development Workflow

### Quick Start

```bash
# Setup
bun install

# Code quality
bun run format   # Format with Prettier
bun run lint:md  # Lint markdown
bun run lint     # Lint TypeScript/JavaScript

# Plugin installation
/plugin marketplace add jbabin91/super-claude
/plugin install meta  # For plugin creators
```

**For complete setup, commands, and troubleshooting, see [docs/workflows/development.md](docs/workflows/development.md)**

## 📝 Commit Conventions

**Format:** `<type>(<scope>): <gitmoji> <description>`

**Example:** `feat(meta): :sparkles: add skill-creator`

**For complete conventions and gitmoji reference, see [docs/workflows/git/commit-conventions.md](docs/workflows/git/commit-conventions.md)**

## 🎯 Session Workflow

### Starting a New Session

1. **Review OpenSpec proposals** - See skill ideas and detailed plans in `openspec/changes/`
2. **Check current priorities** - See "Implementation Priorities" above
3. **Review existing skills** - See what patterns already exist in plugins/
4. **Plan before building** - Use Plan Mode for complex skills

### During Skill Development

1. **RED Phase** - Document failures without skill
2. **GREEN Phase** - Minimal implementation
3. **REFACTOR Phase** - Harden against rationalizations
4. **Test thoroughly** - Manual testing in Claude Code
5. **Document learnings** - Update docs with insights

### Before Committing

1. Verify skill works in Claude Code
2. Check .gitignore (no personal configs)
3. Update README if adding new skill
4. Follow [commit conventions](docs/workflows/git/commit-conventions.md)
5. Run format and lint: `bun run format && bun run lint:md && bun run lint`

**For complete git workflow, see [docs/workflows/git/github-flow.md](docs/workflows/git/github-flow.md)**

## 🚀 Quick Reference

**Documentation Hub:** [docs/README.md](docs/README.md)

**Most Important Resources:**

1. **[Architecture Decisions](docs/architecture/INDEX.md)** - Strategic ADRs (Base UI, PostgreSQL, WCAG AAA)
2. **[OpenSpec Changes](openspec/changes/)** - Plugin proposals with detailed skill plans
3. **[Project Conventions](openspec/project.md)** - Tech stack and coding standards
4. **[GitHub Flow](docs/workflows/git/github-flow.md)** - Branching, PRs, and commit process
5. **[Development Guide](docs/workflows/development.md)** - Setup and common commands

**Key Patterns:**

- **Progressive Disclosure** - SKILL.md (<500 lines) + API_REFERENCE.md (~2.5x token savings)
- **RED-GREEN-REFACTOR** - Skill development methodology
- **No Barrel Exports** - Explicit exports only (better tree-shaking)
- **WCAG AAA** - Accessibility standard (AA minimum where AAA impractical)
- **Auto-Activation** - Skills activate based on prompt keywords/patterns

**Quick Commands:**

```bash
# Setup and quality
bun install                            # Install dependencies
bun run format && bun run lint:md     # Format and lint before commit
bun run lint                           # Lint TypeScript/JavaScript

# Plugin installation
/plugin marketplace add jbabin91/super-claude
/plugin install meta                   # For plugin creators
/plugin install design-system          # Base UI components

# Git workflow
git checkout -b feat/your-feature      # Create feature branch
git commit -m "feat: :sparkles: ..."   # Conventional commit
gh pr create                           # Create pull request
```

---

**Remember:** This is a PUBLIC repository. Always test skills before committing!
