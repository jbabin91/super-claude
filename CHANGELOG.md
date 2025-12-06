# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **workflow plugin (v0.5.1)** - Comprehensive hooks audit and bug fixes
  - Hooks and skills now default to disabled when no config found (opt-in behavior)
  - Fixed null access in `skill-activation-prompt.ts` when `promptTriggers` properties undefined
  - Fixed silent git failure in `git-commit-guard.ts` - now logs warning and validates git repo
  - Fixed non-null assertions in `branch-name-validator.ts` and `type-checker.ts`
  - Fixed command injection risk in `session-checklist.ts` - validates count parameter
  - Standardized exit codes to 0 across all hooks (don't block user workflow on errors)
  - Added `checkHookEnabled()` to `session-start.ts` - can now be disabled via config

### Changed

- **workflow plugin (v0.5.1)** - Migrated all hooks to unified config loader
  - `type-checker`, `session-checklist`, and `session-start` now use `super-claude-config-loader.ts`
  - Removed deprecated `config-loader.ts` and updated `utils/index.ts` exports
  - All hooks now consistently default to disabled when no config found
  - Added `sessionStart` hook to plugin config defaults

## [0.6.0] - 2025-01-20

### Changed

- **workflow plugin (v0.5.0)** - Command renamed and hooks updated to opt-in
  - Renamed `/configure-activation` → `/workflow:configure` for namespace consistency
  - Blocking hooks now opt-in by default: `gitCommitGuard.enabled: false`, `branchNameValidator.enabled: false`
  - Non-blocking hooks stay enabled: `typeChecker.enabled: true`, `sessionChecklist.enabled: true`
  - Rationale: Blocking hooks change user workflows and should be intentional

### Fixed

- **type-checker hook** - Hardened dynamic import with better error handling
  - Added defensive check that `checkFiles` function exists after import
  - Better error messages for missing dependencies with install instructions
  - Separate error formatting for hook configuration errors vs type errors
  - Graceful handling of module-not-found errors

### Added

- **super-claude-config.schema.json** - Added `_comment` field support
  - Allows string or array of strings for inline documentation
  - Comments are ignored by schema validator but visible in JSON files

## [0.5.3] - 2025-01-13

### Fixed

- **workflow plugin (v0.4.2)** - Fixed duplicate hooks loading error
  - Removed `hooks` field from plugin.json (hooks/hooks.json is auto-discovered by Claude Code)
  - Plugin now loads successfully without "Duplicate hooks file detected" error
  - Updated schemas to document that hooks/hooks.json is auto-discovered (like skills/ directory)

### Added

- **Validation** - Enhanced to detect duplicate hooks/hooks.json references
  - Validates that `hooks` field doesn't reference the standard `./hooks/hooks.json` path
  - Warns: "hooks field references './hooks/hooks.json' which is auto-discovered by Claude Code"
  - Prevents duplicate loading errors before plugin installation

## [0.5.2] - 2025-01-13

### Fixed

- **workflow plugin (v0.4.1)** - Fixed missing hooks.json file that caused plugin loading errors
  - Moved `hooks/hooks.json` to correct location (was in `.claude-plugin/hooks/` but Claude Code looks for it relative to plugin root)
  - Plugin now loads successfully without "hooks path not found" error

### Added

- **Validation** - Enhanced filesystem validation to prevent broken plugin references
  - Added `validateFilesystemReferences()` function to validate-schemas.ts
  - Checks that hooks.json, .mcp.json, commands, and agents paths exist
  - Validates hooks.json structure with hooksSchema after file existence check
  - Validates MCP server configs have required "command" field
  - Catches missing files before plugin installation (example: `hooks references missing file: "hooks/hooks.json"`)

## [0.5.1] - 2025-01-12

### Added

- **GitHub Workflow Documentation** - Comprehensive PR guidelines for AI assistants and developers
  - Added `.github/AGENTS.md` with detailed PR guidelines, commit conventions (conventional commits + gitmoji), branching strategy (GitHub Flow), and troubleshooting
  - Enhanced `.github/PULL_REQUEST_TEMPLATE.md` with prominent comment block highlighting best practices for concise PR descriptions
  - Documented target of ~50 lines for PR descriptions, scannable in ~30 seconds, with do/don't examples
  - Added managed blocks to `AGENTS.md` for conditional loading of specialized workflows (GitHub, OpenSpec, Standards, Architecture, Project)

### Fixed

- **Plugin Schemas** - Comprehensive schema improvements for Claude Code compliance
  - Removed invalid `skills` and `subAgents` fields from plugin.json schema (skills are auto-discovered from `skills/` directory)
  - Added full MCP server configuration validation (command, args, env, cwd)
  - Added GitHub/Git URL source format validation for marketplace.json
  - Added all missing plugin entry fields to marketplace schema (author, homepage, repository, license, tags, commands, agents, hooks, mcpServers, strict)
  - Made `author.name` required in plugin.json for consistency with marketplace `owner.name` requirement
  - Added skill name length validation (max 64 chars per Claude Code spec)
  - Added skill description length validation (max 1024 chars per Claude Code spec)
  - Added `allowed-tools` field to skill frontmatter schema (Claude Code official field)
  - Ensured JSON schemas (.claude-plugin/) and arktype schemas (schemas/) are fully in sync

### Changed

- **Validation** - Enhanced strict validation to match Claude Code runtime behavior
  - Added `"additionalProperties": false` to JSON schemas to reject unknown properties
  - Added `.onUndeclaredKey('reject')` to arktype schemas for runtime validation
  - Fixed arktype error detection in validation script (now properly catches validation errors)
  - Updated validation script to check for `'summary' in result` instead of `instanceof Error`
  - Fixed invalid arktype union syntax in marketplace.schema.ts (`'string | string[]'` → `type('string').or(type('string[]'))`)
  - Clarified that `version` field in skill frontmatter is optional (can be omitted for stable skills or initial versions)

## [0.5.0] - 2025-11-09

### Added

- **Unified Plugin Configuration System** - Configure skills and hooks in one place (workflow plugin v0.4.0)
  - JSON Schema validation (`.claude-plugin/super-claude-config.schema.json`)
  - TypeScript types with extensible index signatures (`config-types.ts`)
  - ArkType runtime validation with custom validation result types (`config-validation.ts`)
  - Configuration loader with deep merge, caching, and priority system (`super-claude-config-loader.ts`)
  - Plugin defaults: `plugins/*/super-claude-config.json`
  - Project overrides: `.claude/super-claude-config.json`
  - Configuration priority: Environment variables > Project overrides > Plugin defaults
  - `/workflow:configure` v2.0 command with smart migration using AskUserQuestion
  - Backwards compatibility with legacy `skill-rules.json` format
  - Comprehensive documentation (ADR-0012, `docs/guides/plugin-configuration.md`)
  - meta plugin v0.4.0 with default configuration for 6 skills
  - workflow plugin v0.4.0 with default configuration for 4 hooks
  - bump-version script now supports --yes flag for non-interactive use

### Changed

- **git-commit-guard hook** - Now reads `protectedBranches` and `bypassEnvVar` from configuration
- **branch-name-validator hook** - Now reads `allowedPrefixes` and `allowedBranches` from configuration

### Changed

- **Plugin Naming Cleanup** - Removed `-tools` suffix for cleaner, more natural names
  - **Before → After** format:
    - `claude-tools` → `meta` (meta-tools for creating skills, commands, agents, hooks, plugins)
    - `frontend-tools` → `design-system` (Base UI, shadcn/ui, design tokens, accessibility)
    - `testing-tools` → `testing`
    - `typescript-tools` → `typescript`
    - `git-tools` → `git`
    - `devops-tools` → `devops`
  - Updated `.claude-plugin/marketplace.json` to reflect new names
  - Updated all documentation (README.md, CLAUDE.md) with correct plugin names and installation examples

- **File Naming Conventions** - Removed redundant type suffixes
  - Agent files no longer require `-agent` suffix (directory structure indicates type)
  - Updated CLAUDE.md naming conventions to match

### Removed

- **Outdated Documentation** - Deleted old docs (git history preserved):
  - `SESSION_SUMMARY.md` (outdated project setup from 2025-01-21)
  - `docs/2025-10-22/cleanup-plan.md` (work completed)
  - `docs/2025-10-22/cleanup-plan-revised.md` (work completed)
  - `openspec/README.md` (redundant - content already in AGENTS.md and project.md)

### Planned

**Tier 1 Plugins** (see OpenSpec proposals in `openspec/changes/`):

- **workflow** - Skill auto-activation, OpenSpec workflow, session management (high priority - split from meta)
- **frontend** - App architecture, performance, build optimization
- **tanstack** - TanStack Start, Router, Query, Form, Table integration
- **api** - Hono and Elysia API development with OpenAPI + RPC
- **database** - Drizzle ORM for PostgreSQL, SQLite, Turso
- **auth** - better-auth integration with providers and sessions
- **react** - React patterns, hooks, state management
- **storybook** - Story generation and documentation

## [0.4.0] - 2025-11-02

### Added

- **Skill Auto-Activation System** - Skills automatically activate based on user prompts
  - UserPromptSubmit hook with keyword/pattern matching
  - TypeScript interfaces (PluginSkillRules, ProjectSkillRules, SkillConfig)
  - Rule discovery and merging (plugin + project overrides)
  - Priority-based matching (critical > high > medium > low)
  - Performance optimized (<50ms execution)
  - `/workflow:configure` command - Generate project overrides
  - `/generate-skill-rules` command - Migrate YAML triggers to JSON
  - Comprehensive documentation (SKILL_ACTIVATION_GUIDE.md)
  - meta plugin v0.2.0 with activation rules for all meta-tools

- **OpenSpec Workflow Integration** - Spec-driven development commands
  - `/openspec:proposal` - Create new change proposals
  - `/openspec:work` - Start/resume work on changes
  - `/openspec:status` - Check progress
  - `/openspec:checkpoint` - Save progress to design.md
  - `/openspec:apply` - Implement approved changes
  - `/openspec:done` - Complete and archive changes
  - `/openspec:archive` - Archive completed changes
  - Session persistence with `active.json` tracking
  - Comprehensive workflow guide (OPENSPEC_WORKFLOW_GUIDE.md)

- **Plugin Distribution Design** - Documented plugin marketplace architecture
  - Plugin packaging and distribution patterns
  - MCP server integration (e.g., shadcn for design-system)
  - No dependency system - plugins are self-contained
  - Domain bundle strategy for related functionality

## [0.3.0] - 2025-10-22

### Changed

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
  - Created 5 Tier 1 plugin proposals (design-system, tanstack, api, database, auth)
  - All proposals validated with comprehensive specs and scenarios

### Added

- **Plugin Planning** - 8 new plugins documented in proposals:
  - `tanstack` - TanStack Start, Router, Query, Form, Table (Tier 1)
  - `design-system` - Base UI components, shadcn/ui, design tokens (Tier 1)
  - `api` - Hono/Elysia API development (Tier 1)
  - `database` - Drizzle ORM (Tier 1)
  - `auth` - better-auth integration (Tier 1)
  - `react` - React patterns and hooks
  - `storybook` - Story generation
  - `workflow` - Skill activation, OpenSpec, session management

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
  - add-component-generator (replaced with design-system plugin)

## [0.2.0] - 2025-10-21

### Added

- Plugin marketplace structure (`.claude-plugin/marketplace.json`)
- 6 plugin categories with manifests (renamed in v0.5.0):
  - **skill-tools** (now **meta**) - Meta-tools for creating skills, commands, hooks, agents, and plugins
  - **typescript-tools** (now **typescript**) - TypeScript development utilities
  - **testing-tools** (now **testing**) - Testing automation
  - **git-tools** (now **git**) - Git workflow automation
  - **frontend-tools** (now **design-system**) - React/Frontend development
  - **devops-tools** (now **devops**) - DevOps automation
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
