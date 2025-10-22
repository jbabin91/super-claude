# Project Context

## Purpose

**super-claude** is a comprehensive collection of Claude Code skills, agents, hooks, and utilities designed to automate repetitive development workflows and enforce best practices. The project focuses on the TypeScript, React, and Node.js ecosystem, providing reusable patterns for quality engineering.

### Goals

- Automate repetitive development workflows
- Enforce best practices and quality standards
- Support both personal and work projects (with privacy considerations)
- Provide reusable patterns for the TypeScript/React/Node ecosystem
- Create a community-driven skill marketplace

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

- **Format:** `{category}` or `{category}-{purpose}` (no `-tools` suffix except for claude-tools)
- **Examples:** `tanstack`, `api`, `database`, `auth`, `components`, `testing`, `git`, `typescript`
- **Special case:** `claude-tools` (meta-tools for creating other enhancements)
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

- **Format:** `{name}-agent.md` (WITH `-agent` suffix)
- **Location:** `plugins/{plugin}/agents/{name}-agent.md`
- **Examples:**
  - `hono-agent.md`
  - `api-agent.md`
  - `component-agent.md`
- **Rationale:** `-agent` suffix helps distinguish from skills with similar names

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
├── skill-tools/                 # Meta-tools for creating skills
├── typescript-tools/            # TypeScript development
├── testing-tools/               # Testing automation
├── git-tools/                   # Git workflows
├── frontend-tools/              # React/Frontend tools
└── devops-tools/                # DevOps automation
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
