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

<!-- GITHUB:START -->

# GitHub Workflow Instructions

These instructions are for AI assistants working with git and GitHub.

Always open `@/.github/AGENTS.md` when the request involves:

- Git operations (commit, push, pull, branch, merge, rebase)
- Pull requests (create, update, review, description)
- GitHub workflows (actions, CI/CD, releases)
- Commit conventions (conventional commits, gitmoji)

Use `@/.github/AGENTS.md` to learn:

- Pull request guidelines and template usage
- Commit message conventions
- Branching strategy and GitHub Flow
- GitHub CLI commands

Keep this managed block for consistency with other workflow docs.

<!-- GITHUB:END -->

<!-- STANDARDS:START -->

# Code & Documentation Standards

These instructions are for formatting and documentation standards.

Always open `@/docs/standards/markdown.md` when the request involves:

- Writing or editing markdown files
- Fixing markdown lint errors (MD040, MD032, etc.)
- Creating documentation
- Formatting issues in .md files
- markdownlint warnings

Use `@/docs/standards/markdown.md` to learn:

- Markdown formatting rules
- Code block requirements
- List formatting standards
- Heading conventions
- Common linting errors and fixes

Keep this managed block for consistency with other workflow docs.

<!-- STANDARDS:END -->

<!-- ARCHITECTURE:START -->

# Architecture Decisions

These instructions are for strategic technical decisions and ADR workflow.

Always open `@/docs/architecture/INDEX.md` when the request involves:

- Making strategic technical decisions
- Understanding why we chose a technology
- Evaluating alternatives or trade-offs
- Creating ADRs (Architecture Decision Records)
- Questions about "why" we do things a certain way
- ADR vs OpenSpec workflow (when to use which)

Use `@/docs/architecture/INDEX.md` to learn:

- Existing architecture decisions
- Technology choices and rationale
- Strategic patterns and standards
- ADR catalog and references
- Complete ADR workflow and decision trees

Keep this managed block for consistency with other workflow docs.

<!-- ARCHITECTURE:END -->

<!-- PROJECT:START -->

# Project Release Workflow

These instructions are for versioning, changelog, and release management.

Always open `@/docs/workflows/project.md` when the request involves:

- Versioning plugins (bump version, version conflicts)
- Updating CHANGELOG.md
- Archiving OpenSpec changes after deployment
- Creating releases or tags
- Questions about "how do I version", "update changelog"

Use `@/docs/workflows/project.md` to learn:

- Version bumping process and scripts
- CHANGELOG format and categories
- Archive workflow and checklist
- Release process and GitHub releases

Keep this managed block for consistency with other workflow docs.

<!-- PROJECT:END -->

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

## 📁 File Organization Pattern

**IMPORTANT for AI assistants editing instruction files:**

This project uses a hierarchical instruction file system with `@` import syntax to avoid duplication:

- **CLAUDE.md** - Claude Code-specific config, imports AGENTS.md only
- **AGENTS.md** (this file) - Main agent instructions with managed blocks for specialized workflows
- **`.github/AGENTS.md`** - GitHub workflow details - **loaded conditionally** (via GITHUB managed block)
- **`openspec/AGENTS.md`** - OpenSpec workflow details - **loaded conditionally** (via OPENSPEC managed block)

**Rule: Use `@filename` syntax to import, don't duplicate content between files.**

**Import Strategy (3-tier token management):**

- **Core instructions** (AGENTS.md) - Always loaded, contains project context and managed blocks (~8-10k tokens)
- **Conditional workflows** (managed blocks) - AI assistants should read when keywords appear (~2-4k tokens each)
  - OPENSPEC block → AI should read `openspec/AGENTS.md` (proposal, spec, change, plan)
  - GITHUB block → AI should read `.github/AGENTS.md` (commit, push, pr, branch)
  - STANDARDS block → AI should read `docs/standards/markdown.md` (format, lint, documentation)
  - ARCHITECTURE block → AI should read `docs/architecture/INDEX.md` (decisions, rationale, ADRs)
  - PROJECT block → AI should read `docs/workflows/project.md` (version, changelog, archive, release)
- **Reference-only docs** (markdown links) - Claude reads when explicitly needed (~0 tokens until referenced)
  - `docs/workflows/development.md` - Development setup and common commands
  - `docs/guides/*` - Skill activation, hooks, plugin configuration

**What are tokens?**

Token counts represent the input context size that Claude reads at the start of each session. Claude has a 200k token context window - these estimates show how much of that budget gets consumed by documentation. Lower token usage leaves more room for code, conversation history, and tool outputs. The managed block system keeps base documentation lean (~8-10k) while allowing targeted loading (2-4k per block) only when needed.

**Token efficiency examples:**

- Exploration session (reading code): ~8-10k tokens (no blocks loaded)
- Coding + commit session: ~10-12k tokens (GITHUB loaded)
- Planning session: ~11-14k tokens (OPENSPEC loaded)
- Formatting/docs session: ~12-15k tokens (STANDARDS loaded)
- Architecture decisions: ~10-13k tokens (ARCHITECTURE loaded)
- Release/archive session: ~11-14k tokens (PROJECT loaded)
- Full workflow session: ~20-26k tokens (multiple blocks loaded)

## 🔒 Privacy & Security

### Public Content

- `plugins/*` - Generic, reusable plugins with skills
- Documentation and architectural guides
- Marketplace configuration

### Project-Specific Skills

For project-specific or work-related skills:

- Install plugins from marketplace: `/plugin install <plugin-name>`
- Create project-specific skills in: `<project>/.claude/skills/`

See **[Plugin Structure Standards](docs/standards/plugin-structure.md)** for naming conventions and organization.

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

**For detailed skill plans and priorities, see:**

- **[OpenSpec Changes](openspec/changes/)** - Active proposals and specifications
- **[OpenSpec Workflow Guide](openspec/AGENTS.md)** - Complete proposal workflow
- **[Project Workflow](docs/workflows/project.md)** - Versioning and archiving process

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

## 💡 Tech Stack Focus

**For complete tech stack and conventions, see [openspec/project.md](openspec/project.md)**

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
4. Follow commit conventions (conventional commits + gitmoji)
5. Run format and lint: `bun run format && bun run lint:md && bun run lint`

## 🚀 Quick Reference

**Documentation Hub:** [docs/README.md](docs/README.md)

**Most Important Resources:**

1. **[OpenSpec Changes](openspec/changes/)** - Plugin proposals with detailed skill plans
2. **[Project Conventions](openspec/project.md)** - Tech stack and coding standards
3. **[Skill Development Guide](docs/guides/skill-development.md)** - RED-GREEN-REFACTOR, skill format, patterns
4. **[Plugin Structure](docs/standards/plugin-structure.md)** - Naming conventions, directory structure
5. **[Testing Standards](docs/standards/testing.md)** - Testing philosophy, file generation rules
6. **[Project Workflow](docs/workflows/project.md)** - Versioning, changelog, archiving
7. **[Development Guide](docs/workflows/development.md)** - Setup and common commands

**Key Patterns (see docs for details):**

- **Progressive Disclosure** - SKILL.md (<500 lines) + API_REFERENCE.md
- **RED-GREEN-REFACTOR** - Document failures → minimal fix → harden
- **No Barrel Exports** - Explicit exports only (better tree-shaking)
- **Stories = Tests** - Component tests live in .stories.tsx files
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
