# Project Context

## Purpose

**super-claude** is a comprehensive collection of Claude Code skills, agents, hooks, and utilities designed to automate repetitive development workflows and enforce best practices. The project focuses on the TypeScript, React, and Node.js ecosystem, providing reusable patterns for quality engineering.

### Goals

- Automate repetitive development workflows
- Enforce best practices and quality standards
- Support both personal and work projects (with privacy considerations)
- Provide reusable patterns for the TypeScript/React/Node ecosystem
- Create a community-driven skill marketplace

## Architecture Decisions

Strategic architectural decisions for this project are documented as Architecture Decision Records (ADRs).

**Location:** `docs/architecture/decisions/`

**Browse decisions:**

- [docs/architecture/INDEX.md](../docs/architecture/INDEX.md) - Categorical and chronological index
- [docs/architecture/README.md](../docs/architecture/README.md) - ADR usage guide

**Workflow:** When making project-wide technology or architecture choices, create an ADR first before creating OpenSpec proposals. See [openspec/AGENTS.md](AGENTS.md) for the ADR vs OpenSpec decision tree.

**Key Decisions:**

- **Component Library:** Base UI (see [ADR-0001](../docs/architecture/decisions/ADR-0001-adopt-base-ui.md))
- **Primary Database:** PostgreSQL (see [ADR-0002](../docs/architecture/decisions/ADR-0002-use-postgresql-primary-db.md))
- **Fullstack Framework:** TanStack Start (see [ADR-0003](../docs/architecture/decisions/ADR-0003-tanstack-start-over-nextjs.md))
- **Accessibility Standard:** WCAG AAA (see [ADR-0004](../docs/architecture/decisions/ADR-0004-wcag-aaa-accessibility-standard.md))
- **Code Organization:** No Barrel Exports (see [ADR-0005](../docs/architecture/decisions/ADR-0005-no-barrel-exports.md))
- **Skill Documentation:** Progressive Disclosure (see [ADR-0006](../docs/architecture/decisions/ADR-0006-progressive-disclosure-pattern.md))
- **Skill Invocation:** Auto-Activation System (see [ADR-0007](../docs/architecture/decisions/ADR-0007-skill-auto-activation.md))

## Tech Stack

- **Languages:** TypeScript, JavaScript, Markdown
- **Frameworks:** React (for frontend skills)
- **Testing:** Vitest, Playwright
- **Build Tools:** npm, pnpm workspaces, TypeScript Compiler (tsc)
- **Version Control:** Git with conventional commits + gitmoji
- **CI/CD:** GitHub Actions
- **Container:** Docker Compose

## Project Conventions

### Naming Conventions

**CRITICAL: These naming conventions apply to ALL plugins, skills, agents, commands, and hooks in this project.**

#### Plugins

- **Format:** `{category}` or `{category}-{purpose}` (no `-tools` suffix)
- **Examples:** `tanstack`, `api`, `database`, `auth`, `design-system`, `testing`, `git`, `typescript`
- **Special case:** `meta` (meta-tools for creating skills, commands, agents, hooks, plugins)
- **Rationale:** Simple, descriptive names without redundant suffixes

#### Skills

- **Format:** Descriptive kebab-case name (NO `-skill` suffix)
- **Location:** `plugins/{plugin}/skills/{name}/SKILL.md`
- **Examples:**
  - `hono.md` (not `hono-skill.md`)
  - `api.md` (not `api-skill.md`)
  - `component-generator.md` (not `component-generator-skill.md`)
  - `drizzle-maestro.md` (not `drizzle-maestro-skill.md`)
- **Rationale:** The `skills/` directory already indicates the type

#### Agents

- **Format:** Descriptive kebab-case name (NO `-agent` suffix)
- **Location:** `plugins/{plugin}/agents/{name}.md`
- **Examples:**
  - `hono.md` (not `hono-agent.md`)
  - `api.md` (not `api-agent.md`)
  - `component.md` (not `component-agent.md`)
- **Rationale:** The `agents/` directory already indicates the type

#### Commands

- **Format:** Verb phrases in kebab-case (NO `-command` suffix)
- **Location:** `plugins/{plugin}/commands/{name}.md`
- **Examples:**
  - `create-hono-api.md` (not `create-hono-api-command.md`)
  - `generate-component.md`
  - `setup-auth.md`
- **Rationale:** The `commands/` directory already indicates the type

#### Hooks

- **Format:** Event-based or lifecycle names (NO `-hook` suffix)
- **Location:** `plugins/{plugin}/hooks/{name}.md`
- **Examples:**
  - `pre-commit.md` (not `pre-commit-hook.md`)
  - `post-deploy.md`
  - `on-error.md`
- **Rationale:** The `hooks/` directory already indicates the type

### Code Style

- **File Naming:** kebab-case for files and directories (see Naming Conventions above)
- **Markdown:** Follow markdownlint rules (MD040, MD032, MD022/MD023)
  - Always use language identifiers in code fences
  - Blank lines before lists and after headings
  - Use `sh` for terminal/CLI, `txt` for general text, specific languages otherwise
- **YAML Frontmatter:** Required in all SKILL.md files with name, version, description, category, tags, model, requires, and triggers

### Architecture Patterns

**Plugin Marketplace Structure:**

```sh
.claude-plugin/marketplace.json  # Marketplace registry
plugins/
├── meta/                        # Meta-tools for creating skills, commands, agents
├── design-system/               # Component libraries (Base UI, shadcn/ui)
├── testing/                     # Testing automation
├── typescript/                  # TypeScript development
├── git/                         # Git workflows
└── devops/                      # DevOps automation
```

**Key Patterns:**

1. **Progressive Disclosure** - SKILL.md (~500 lines) → API_REFERENCE.md (advanced topics)
2. **Universal Executor** - For test frameworks and CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology:
   - RED: Document failures without skill
   - GREEN: Minimal implementation
   - REFACTOR: Harden against rationalizations
4. **Context-Aware Activation** - Auto-trigger via keywords/patterns in YAML frontmatter

### Testing Strategy

**Skill Testing Approach:**

- **Manual Testing Required** - All skills must be tested in Claude Code before committing
- **RED-GREEN-REFACTOR Validation** - Document failures, implement, and verify
- **No Untested Skills** - This is a hard requirement
- **Test Scenarios:**
  - Monorepo compatibility
  - Cross-platform (macOS, Linux, Windows)
  - Different package managers (npm, pnpm, yarn)

**Code Testing (for runtime tools):**

- **Framework:** Vitest for unit/integration tests
- **E2E:** Playwright for end-to-end testing
- **Coverage:** Target 80%+ coverage for critical paths

### Git Workflow

**Branching Strategy:**

- **Main Branch:** `main` (default)
- **Feature Branches:** `[type]/[description]` (e.g., `feat/add-smart-commit`)
- **PR Merges:** Squash and merge to main

**Commit Conventions:**

```txt
<type>(<scope>): <gitmoji> <description>

Examples:
feat(typescript): :sparkles: add tsc-files-validation skill
docs: :memo: update RESEARCH_FINDINGS with playwright analysis
fix(git): :bug: correct smart-commit message parsing
chore: :hammer: update installation scripts
```

**Commit Types:**

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

## Domain Context

**Claude Code Skills:**

Claude Code is a CLI tool for AI-assisted software development. Skills are Markdown files with YAML frontmatter that provide context and instructions to the AI assistant. Skills can be installed globally (`~/.claude/skills/`) or per-project (`.claude/skills/`).

**Skill Lifecycle:**

1. **Discovery:** Skills auto-activate based on conversation triggers (keywords, patterns)
2. **Execution:** Claude reads SKILL.md and follows instructions
3. **Progressive Disclosure:** Advanced topics loaded on-demand from API_REFERENCE.md

**Community Patterns:**

Research from 11 GitHub repositories and 200+ skills identified:

- **obra/superpowers** (324★) - TDD workflows, systematic debugging
- **lackeyjb/playwright-skill** - Universal executor pattern for test frameworks
- **anthropics/skills** - Official examples, progressive disclosure

## Important Constraints

### Privacy & Security

- **Public Repository:** No personal configs, API keys, or work-specific information
- **Gitignored Content:**
  - `configs/global.json` - Personal configuration
  - `configs/projects/*.json` - Project-specific configs
- **Public Content:**
  - `plugins/*` - Generic, reusable skills
  - Documentation and templates
  - Marketplace configuration

### Token Efficiency

- **SKILL.md Target:** < 500 lines (core instructions)
- **Progressive Disclosure Goal:** ~2.5x token savings vs persistent MCP servers
- **Minimal Frontmatter:** Only required fields in YAML

### Quality Standards

- **No Untested Skills** - Every skill must be manually tested before commit
- **No Placeholders** - No TODOs, "YOUR_KEY_HERE", or stub implementations
- **No Narrative Examples** - Skills must be generic, not tied to specific sessions
- **Single Ecosystem Focus** - TypeScript/JavaScript/React only (avoid multi-language dilution)

## External Dependencies

### Required Tools

- **Claude Code CLI** - The runtime environment for skills
- **Git** - Version control and workflows
- **Node.js** - JavaScript runtime
- **npm/pnpm** - Package management

### Optional Tools (per skill)

- **TypeScript Compiler (tsc)** - For typescript-tools skills
- **Vitest** - For testing-tools skills
- **Playwright** - For E2E testing skills
- **Docker/Docker Compose** - For devops-tools skills

### External Services

- **GitHub** - Repository hosting, CI/CD (GitHub Actions)
- **NPM Registry** - Package publishing (future consideration)
