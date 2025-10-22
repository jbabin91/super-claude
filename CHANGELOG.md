# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### In Progress

Skills currently in development (see `openspec list` for details):

- **add-cli-testing-skill** - CLI testing with universal executor pattern (0/64 tasks)
- **add-smart-commit-skill** - Conventional commits with gitmoji automation (0/53 tasks)
- **add-refactor-imports-skill** - Import organization and cleanup (0/27 tasks)
- **add-generate-tests-skill** - TypeScript test generation (0/16 tasks)
- **add-fix-types-skill** - Auto-fix common TypeScript errors (0/16 tasks)
- **add-worktree-helper-skill** - Git worktree management (0/14 tasks)
- **add-pr-description-skill** - Auto-generate PR descriptions (0/11 tasks)
- **add-changelog-skill** - Automated changelog generation (0/11 tasks)

## [0.2.0] - 2025-01-21

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

## [0.1.0] - 2025-01-21

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
