# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Skill Auto-Activation System** - Skills now automatically activate based on user prompts (inspired by diet103's battle-tested setup)
  - UserPromptSubmit hook with keyword/pattern matching
  - TypeScript interfaces (PluginSkillRules, ProjectSkillRules, SkillConfig)
  - Rule discovery and merging (plugin + project overrides)
  - Priority-based matching (critical > high > medium > low)
  - Performance optimized (<50ms execution)
  - `/configure-activation` command - Generate project overrides
  - `/generate-skill-rules` command - Migrate YAML triggers to JSON
  - Comprehensive documentation (SKILL_ACTIVATION_GUIDE.md)
  - claude-tools v0.2.0 with activation rules for all meta-tools

### In Progress

**Tier 1 Plugins** (see OpenSpec proposals in `openspec/changes/`):

- **components-plugin** - Base UI components, design systems, WCAG AAA accessibility, Radix migration
- **tanstack-plugin** - TanStack Start, Router, Query, Form, Table integration
- **api-plugin** - Hono and Elysia API development with OpenAPI + RPC
- **database-plugin** - Drizzle ORM for PostgreSQL, SQLite, Turso
- **auth-plugin** - better-auth integration with providers and sessions

## [0.3.0] - 2025-10-22

### Changed

- **Plugin Structure** - Restructured from generic `-tools` suffix to specific plugin names
  - Renamed `skill-tools` → `claude-tools` (meta-tools for creating Claude Code enhancements)
  - Renamed `frontend-tools` → `components` (Base UI components and design systems)
  - Renamed `testing-tools` → `testing` (runtime-agnostic testing)
  - Renamed `typescript-tools` → `typescript`
  - Renamed `git-tools` → `git`
  - Renamed `devops-tools` → `devops`

- **Tech Stack Focus** - Pivoted to TanStack Start, Base UI, Hono, Drizzle, better-auth
  - TanStack Start preferred over monorepos
  - Base UI for new components (Radix UI migration support)
  - Hono for API development (Elysia for exploration)
  - Drizzle ORM for database
  - better-auth for authentication

- **Documentation** - Complete overhaul aligned with new tech stack
  - Updated README.md with "Choose Your Stack" installation examples
  - Updated CLAUDE.md with Tier 1-4 priorities from brainstorm
  - Added component file structure standards (explicit exports, tests in .stories.tsx)
  - Added Base UI vs Radix UI guidance

- **OpenSpec Proposals** - Cleaned up and created new plugin proposals
  - Deleted 9 outdated proposals (tsc-files, smart-commit, etc.)
  - Created 5 Tier 1 plugin proposals (components, tanstack, api, database, auth)
  - All proposals validated with comprehensive specs and scenarios

### Added

- **Plugin Categories** - 8 new plugins planned:
  - `tanstack` - TanStack Start, Router, Query, Form, Table (Tier 1)
  - `components` - Base UI components, design systems (Tier 1)
  - `api` - Hono/Elysia API development (Tier 1)
  - `database` - Drizzle ORM (Tier 1)
  - `auth` - better-auth integration (Tier 1)
  - `react` - React patterns and hooks
  - `storybook` - Story generation
  - `monorepo` - Turborepo/pnpm workspaces (lower priority)

- **Brainstorm Documentation** - `docs/2025-10-22/`
  - `brainstorm.md` - 18 skills, 4 agents, 7 commands, 8 hooks organized by tier
  - `decisions.md` - Tech stack decisions and component structure standards
  - `plugin-structure.md` - Plugin organization and installation matrix
  - `cleanup-plan-revised.md` - Documentation cleanup strategy

### Removed

- **Outdated Documentation**
  - ROADMAP.md (outdated priorities, obra/superpowers focus)
  - GETTING_STARTED.md (redundant with README)
  - RESEARCH_FINDINGS.md (preserved in git history)
  - docs/CREATING_SKILLS.md (redundant with skill-creator)

- **Old OpenSpec Proposals** - 9 proposals not aligned with new tech stack
  - add-changelog-skill
  - add-cli-testing-skill
  - add-fix-types-skill
  - add-generate-tests-skill
  - add-pr-description-skill
  - add-refactor-imports-skill
  - add-smart-commit-skill
  - add-worktree-helper-skill
  - add-component-generator (replaced with components-plugin)

## [0.2.0] - 2025-10-21

### Added

- Plugin marketplace structure (`.claude-plugin/marketplace.json`)
- 6 plugin categories with manifests:
  - **skill-tools** - Meta-tools for creating skills, commands, hooks, agents, and plugins
  - **typescript-tools** - TypeScript development utilities
  - **testing-tools** - Testing automation
  - **git-tools** - Git workflow automation
  - **frontend-tools** - React/Frontend development
  - **devops-tools** - DevOps automation
- **skill-creator** - Create new skills with proper structure and validation
- **command-creator** - Generate slash commands
- **hook-creator** - Create event-driven hooks
- **agent-creator** - Build specialized agents
- **plugin-creator** - Generate complete plugin packages
- **skill-validator** - Validate skills against specifications
- OpenSpec integration for change proposals and tracking
- Claude Code settings configuration (`.claude/settings.json`)
- Markdown formatting standards and linting setup
- Package management with pnpm (prettier, markdownlint-cli2)

### Changed

- Migrated from skills/ to plugins/ architecture
- Updated all documentation for plugin system
- Simplified from 3 skill locations to 2 (global and project-local)
- Established markdown formatting standards (MD040, MD032, MD022/MD023)

### Removed

- Installation scripts (replaced with `/plugin` commands)
- `local/` directory concept
- Old marketplace.json (moved to `.claude-plugin/marketplace.json`)

## [0.1.0] - 2025-10-20

### Added

- Initial project structure and documentation
- Comprehensive .gitignore for privacy
- MIT License
- Repository infrastructure:
  - README.md with project overview
  - CLAUDE.md with AI assistant context
  - Research findings from 11 GitHub repositories
  - Skill development guides
  - Configuration system with templates

### Research

- Analyzed 11 GitHub repositories
- Cataloged 200+ community skills
- Identified key patterns:
  - Progressive disclosure for token efficiency
  - Universal executor pattern for test frameworks
  - RED-GREEN-REFACTOR methodology
  - Context-aware activation
- Documented community best practices

---

## Archive Format

When archiving OpenSpec proposals, add entries in this format:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- **skill-name** - Brief description of what it does

### Changed

- **modified-skill** - What changed and why

### Fixed

- **bugfix-skill** - What issue was resolved
```

**Note:** Version numbers follow semantic versioning:

- **Major (X.0.0)** - Breaking changes
- **Minor (0.Y.0)** - New features, backwards compatible
- **Patch (0.0.Z)** - Bug fixes, backwards compatible
