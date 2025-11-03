<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code when working with the super-claude repository.

## 📋 Project Context

**Project Name:** super-claude
**Purpose:** Comprehensive collection of Claude Code plugins for TanStack Start, Base UI, Hono, and modern TypeScript development
**Focus:** TanStack ecosystem, Base UI components, Hono APIs, Drizzle ORM, better-auth, testing automation
**Status:** 🚧 Active Development - skill-tools complete, building feature plugins

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

- **Format:** `{category}-{purpose}` (no `-tools` suffix)
- **Examples:** `tanstack`, `api`, `database`, `auth`, `components`, `testing`, `git`, `typescript`
- **Special case:** `claude-tools` (meta-tools for creating other enhancements)

#### Skills

- **Format:** Descriptive kebab-case name (NO `-skill` suffix)
- **Location:** `plugins/{plugin}/skills/{name}/SKILL.md`
- **Examples:**
  - `hono.md` (not `hono-skill.md`)
  - `api.md` (not `api-skill.md`)
  - `component-generator.md` (not `component-generator-skill.md`)
  - `drizzle-maestro.md` (not `drizzle-maestro-skill.md`)

#### Agents

- **Format:** `{name}-agent.md` (WITH `-agent` suffix)
- **Location:** `plugins/{plugin}/agents/{name}-agent.md`
- **Examples:**
  - `hono-agent.md`
  - `api-agent.md`
  - `component-agent.md`

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
├── plugins/               # Plugin packages
│   ├── skill-tools/      # Meta-tools (ready)
│   ├── tanstack-tools/   # TanStack ecosystem (in dev)
│   ├── api-tools/        # Backend development (in dev)
│   ├── frontend-tools/   # React/UI (in dev)
│   ├── testing-tools/    # Testing automation (in dev)
│   ├── devops-tools/     # DevOps (planned)
│   ├── git-tools/        # Git workflows (planned)
│   └── typescript-tools/ # TypeScript (planned)
├── .claude-plugin/        # Marketplace configuration
└── docs/                  # Brainstorm sessions and decisions
```

### Key Files

- **docs/2025-10-22/brainstorm.md** - Skill ideas and priorities (READ THIS FIRST!)
- **docs/2025-10-22/decisions.md** - Tech stack decisions and clarifications
- **docs/2025-10-22/plugin-structure.md** - Plugin organization and installation matrix
- **.claude-plugin/marketplace.json** - Plugin marketplace manifest

### Auto-Activation System

**Status:** ✅ Implemented and ready to use

The skill auto-activation system automatically suggests relevant skills before Claude responds based on user prompts. This replaces manual skill invocation with intelligent, context-aware activation.

#### How It Works

1. **User submits prompt** → Claude Code triggers `UserPromptSubmit` hook
2. **Hook analyzes prompt** → Matches against keywords and intent patterns
3. **Suggests relevant skills** → Formatted output appears before user's prompt
4. **Claude sees suggestions** → Uses appropriate skills in response

#### Architecture

**Per-Plugin Rules + Runtime Aggregation:**

```sh
.claude/skills/
├── claude-tools/
│   └── skill-rules.json       # Plugin's activation rules
├── tanstack-tools/
│   └── skill-rules.json       # Another plugin's rules
└── skill-rules.json           # Project overrides (optional)
```

**Hook Runtime:**

- Bun + TypeScript for maintainability
- Discovers all `skill-rules.json` files from installed plugins
- Merges with project overrides (precedence: project > plugin)
- Executes in <50ms for typical projects

#### skill-rules.json Format

Each plugin defines activation rules for its skills:

```json
{
  "plugin": {
    "name": "claude-tools",
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

**Matching Strategies:**

- **Keywords:** Case-insensitive literal matching
- **Intent Patterns:** Regex with case-insensitive flag
- **Priorities:** critical > high > medium > low

#### Project Overrides

Customize activation rules for your project in `.claude/skills/skill-rules.json`:

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

**Generate template:**

```bash
/configure-activation
```

#### Files and Locations

**Plugin-level rules:**

- `plugins/{plugin-name}/skills/skill-rules.json` - Define activation rules
- `plugins/{plugin-name}/templates/skill-rules.template.json` - Template for plugin authors

**Project-level overrides:**

- `.claude/skills/skill-rules.json` - Customize for your project
- Generate with `/configure-activation` command

**Hook implementation:**

- `plugins/claude-tools/hooks/skill-activation-prompt.ts` - Main hook logic
- `plugins/claude-tools/types/skill-rules.d.ts` - TypeScript definitions

**Documentation:**

- `docs/SKILL_ACTIVATION_GUIDE.md` - Comprehensive user guide (coming soon)
- `openspec/changes/add-skill-auto-activation/` - OpenSpec proposal and design

#### Benefits

- **Zero configuration** - Works out of box with plugin defaults
- **Consistent activation** - No more forgotten skills
- **Customizable** - Override priorities and triggers per project
- **Fast** - <50ms execution time
- **Clean install/uninstall** - Each plugin manages its own rules

#### Troubleshooting

**Hook not running:**

- Ensure Bun is installed: `bun --version`
- Check hook location: `.claude/hooks/skill-activation-prompt.ts`
- Verify hook is executable: `chmod +x .claude/hooks/skill-activation-prompt.ts`

**Skills not activating:**

- Check plugin has `skill-rules.json` in `.claude/skills/{plugin-name}/`
- Verify keywords/patterns match your prompt
- Test with explicit keywords (e.g., "create skill")

**Performance issues:**

- Keep project overrides minimal
- Limit `maxSkillsPerPrompt` in global config
- Check hook execution time in warnings

## 🔒 Privacy & Security

### Public Content

- `plugins/*` - Generic, reusable plugins with skills
- Documentation and brainstorm sessions
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
   - Use skill-creator from skill-tools plugin
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

**ALWAYS follow these markdownlint rules to avoid warnings:**

#### 1. Code Fences Must Have Language Identifiers (MD040)

**Wrong:**

````markdown
```
code here
```
````

**Right:**

````markdown
```sh
code here
```

```txt
text content
```

```yaml
yaml: content
```
````

#### 2. Blank Line Required Before Lists (MD032)

**Wrong:**

```markdown
Ask the user:

- **Purpose**: What does this do?
```

**Right:**

```markdown
Ask the user:

- **Purpose**: What does this do?
```

#### 3. Blank Line After Headings Before Content (MD022/MD023)

**Wrong:**

```markdown
### Model Selection Guide

### Haiku (Fast & Cheap)

- Simple tasks
```

**Right:**

```markdown
### Model Selection Guide

### Haiku (Fast & Cheap)

- Simple tasks
```

#### 4. Blank Line Before Nested Content

**Wrong:**

```markdown
**Solution**:

- Check syntax
```

**Right:**

```markdown
**Solution**:

- Check syntax
```

#### Common Language Identifiers

**Preferred Usage:**

- `sh` - Terminal/CLI examples, folder structures, shell commands
- `txt` - Default fallback when unsure what category it falls under
- `yaml` - YAML configuration
- `json` - JSON data
- `markdown` - Markdown examples
- `typescript` or `ts` - TypeScript code
- `javascript` or `js` - JavaScript code
- `jsx` or `tsx` - React components

**Rule of Thumb:** Use `sh` for terminal/CLI and folder structures, use `txt` when unsure.

## 📚 Key Resources

### Before Starting Work

**ALWAYS read these first:**

1. **docs/2025-10-22/brainstorm.md** - Skill ideas and priorities by tier
2. **docs/2025-10-22/decisions.md** - Tech stack decisions
3. **docs/2025-10-22/plugin-structure.md** - Plugin organization
4. **Relevant category in plugins/** - See existing patterns

### Skill Development References

- **skill-creator** (skill-tools plugin) - Generate new skills with proper structure
- **Universal executor pattern** - For test frameworks, CLI testing
- **Progressive disclosure** - SKILL.md → API_REFERENCE.md for token efficiency

### Top Patterns to Use

1. **Progressive Disclosure** - SKILL.md → API_REFERENCE.md (~2.5x token savings)
2. **Universal Executor** - For test frameworks, CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology
4. **Validation Framework** - Multi-layer validation (parameter, data, temporal, completeness)
5. **Context-Aware Activation** - Auto-trigger via keywords/patterns

## 🎯 Implementation Priorities

Based on docs/2025-10-22/brainstorm.md decisions:

### 🔴 Tier 1 - Build First

**tanstack-tools plugin:**

1. **tanstack-start-wizard**
   - Fullstack app setup with TanStack Start
   - File-based routing, server functions
   - Integration with Query, Router, Form

2. **tanstack-query-helper**
   - Server state management patterns
   - Query key organization
   - Cache invalidation strategies

**frontend-tools plugin:**

3. **component-generator**
   - Base UI components with Storybook
   - Structure: component.tsx + component.stories.tsx (with tests) + index.ts
   - Explicit exports (no barrel exports)
   - WCAG AAA accessibility

4. **design-system-orchestrator**
   - Theming with Tailwind + Base UI
   - Design token management
   - WCAG AAA validation
   - Ripple effect analysis for theme changes

5. **radix-to-baseui-migrator**
   - Migration helper for existing Radix UI code
   - Side-by-side comparison
   - Pattern translation

**api-tools plugin:**

6. **hono-api-builder**
   - API endpoints with OpenAPI + RPC
   - Node.js compatible
   - Type-safe routes with Zod validation

7. **drizzle-maestro**
   - Database schema & migrations
   - PostgreSQL, Turso, SQLite support
   - better-auth integration

8. **better-auth-integrator**
   - Authentication providers setup
   - Drizzle schema generation
   - Hono middleware integration

### 🟡 Tier 2 - Testing & Quality

**testing-tools plugin:**

- vitest-component-tester (tests in .stories.tsx)
- storybook-automator (story generation)
- playwright-e2e-generator (E2E testing)

### 🟢 Tier 3 - Workflow Automation

**devops-tools plugin:**

- turborepo-architect (monorepo setup - lower priority)
- pnpm-workspace-manager
- quality-enforcer

**git-tools plugin:**

- smart-commit (conventional commits + gitmoji)
- pr-description
- changelog-generator

### ⚪ Tier 4 - Advanced Features

**typescript-tools plugin:**

- type-safety-enforcer (API ↔ frontend contracts)
- refactor-imports

## 🚫 Anti-Patterns to Avoid

From community research:

- ❌ Narrative examples tied to specific sessions
- ❌ Generic labels (helper1, step2, utils)
- ❌ Code embedded in flowcharts
- ❌ TODOs or placeholders in skills
- ❌ "YOUR_KEY_HERE" style configs
- ❌ Untested skills
- ❌ Multi-language dilution (focus on TS/JS/React)

## 📖 Skill Categories

### TanStack Tools

- TanStack Start fullstack apps
- Router, Query, Form, Table integration
- Server functions and RPC
- File-based routing patterns

### Frontend Tools

- Base UI component generation (not Radix UI)
- Radix UI migration support
- Design system with WCAG AAA validation
- Tailwind utilities
- Storybook + Vitest integration

### API Tools

- Hono/Elysia API development
- Drizzle ORM (PostgreSQL, Turso, SQLite)
- better-auth authentication
- Zod/ArkType validation
- OpenAPI + RPC patterns

### Testing Tools

- Vitest component testing (in .stories.tsx files)
- Storybook story generation
- Playwright E2E testing
- Coverage improvement

### Git Tools

- Smart commits (conventional + gitmoji)
- PR descriptions
- Changelog generation
- Worktree management

### DevOps Tools

- Turborepo/monorepo setup (lower priority)
- pnpm workspace management
- Quality enforcement (git hooks, linting)
- Documentation site generation

### TypeScript Tools

- Type safety enforcement (API ↔ frontend contracts)
- Import refactoring and organization

## 🎓 Key Development Principles

### Skill Quality Standards

1. **Progressive disclosure** - SKILL.md < 500 lines, advanced topics in API_REFERENCE.md
2. **Universal executor pattern** - For test frameworks, CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology
4. **Context-aware activation** - Auto-trigger via keywords/patterns
5. **Token efficiency** - Keep frequently-loaded skills under 500 words

### Testing Principles

**Component Testing:**

- Tests in `.stories.tsx` files (not separate test files)
- Storybook stories include Vitest tests
- WCAG AAA accessibility validation

**Domain Logic Testing:**

- Separate `.test.ts` files for functions/utilities
- Unit → Integration → E2E priority order

### Code Organization

**Component Structure:**

```txt
src/components/ui/button/
├── button.tsx              # Component implementation
├── button.stories.tsx      # Storybook + Vitest tests combined
└── index.ts                # Explicit exports only
```

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

This plugin collection is optimized for:

**Frontend:**

- React + Vite
- TanStack Suite (Start, Router, Query, Form, Table)
- Base UI components (migrating from Radix UI)
- Tailwind CSS
- Storybook + Vitest

**Backend:**

- Hono (primary) and Elysia (exploration)
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

## 🔧 Development Commands

### Installation

```bash
# Add the marketplace
/plugin marketplace add jbabin91/super-claude

# Core (always install first)
/plugin install skill-tools       # Meta-tools for creating skills

# Feature plugins (install based on your stack)
/plugin install tanstack-tools    # TanStack Start, Router, Query, Form, Table
/plugin install api-tools         # Hono, Drizzle, better-auth
/plugin install frontend-tools    # Base UI components, design system, Tailwind
/plugin install testing-tools     # Storybook + Vitest component testing
/plugin install devops-tools      # Turborepo, pnpm workspaces
/plugin install git-tools         # Git workflows
/plugin install typescript-tools  # Type safety and validation
```

### Code Quality

```bash
# Format all files with Prettier
pnpm run format

# Lint markdown files with markdownlint-cli2
pnpm run lint

# Fix auto-fixable markdown issues
pnpm run lint:fix
```

**Important:** Always run `pnpm run format` and `pnpm run lint` before committing to ensure code quality and consistency.

### Creating Skills

Use the skill-tools plugin to create new skills:

```bash
# Install skill-tools first
/plugin install skill-tools

# Skills auto-activate based on conversation context
# Use skill-creator to generate new skills
```

### Testing

```bash
# Manual testing in Claude Code
# 1. Create skill using skill-creator
# 2. Open Claude Code in relevant project
# 3. Trigger skill through conversation
# 4. Verify behavior matches expectations
# 5. Iterate based on failures
```

## 📝 Commit Conventions

Follow conventional commits with gitmoji:

```bash
# Format
<type>(<scope>): <gitmoji> <description>

# Examples
feat(typescript): :sparkles: add tsc-files-validation skill
docs: :memo: update RESEARCH_FINDINGS with playwright analysis
fix(git): :bug: correct smart-commit message parsing
chore: :hammer: update installation scripts
```

**Types:**

- `feat` - New skills or features
- `fix` - Bug fixes in skills
- `docs` - Documentation updates
- `chore` - Maintenance tasks
- `refactor` - Code restructuring
- `test` - Test additions/changes

**Gitmojis:**

- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 📝 `:memo:` - Documentation
- 🔨 `:hammer:` - Scripts/tooling
- ♻️ `:recycle:` - Refactoring

## 🎯 Session Workflow

### Starting a New Session

1. **Review brainstorm.md** - See skill ideas and priorities
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
4. Follow commit conventions

## 🚀 Quick Reference

**Most Important Files:**

1. `docs/2025-10-22/brainstorm.md` - Start here for skill ideas
2. `docs/2025-10-22/decisions.md` - Tech stack decisions
3. `docs/2025-10-22/plugin-structure.md` - Plugin organization

**Key Patterns:**

- Progressive Disclosure (token efficiency)
- Universal Executor (test frameworks)
- RED-GREEN-REFACTOR (skill quality)
- Explicit exports (no barrel exports)
- Tests in .stories.tsx for components

**Installation:**

```bash
/plugin marketplace add jbabin91/super-claude
/plugin install skill-tools       # Meta-tools (always install first)
/plugin install tanstack-tools    # TanStack ecosystem
/plugin install api-tools         # Hono, Drizzle, better-auth
/plugin install frontend-tools    # Base UI components
```

**Creating Skills:**

Use skill-creator from the skill-tools plugin to generate new skills with proper structure and validation.

**Component File Structure:**

```txt
src/components/ui/button/
├── button.tsx              # Implementation
├── button.stories.tsx      # Storybook + Vitest tests
└── index.ts                # Explicit exports only
```

---

**Remember:** This is a PUBLIC repository. Always test skills before committing!
