# Documentation Guide

Welcome to the super-claude documentation! This guide helps you find what you need.

## Quick Navigation

### For AI Assistants

- **[CLAUDE.md](../CLAUDE.md)** - AI instructions for working with this project
- **[openspec/AGENTS.md](../openspec/AGENTS.md)** - OpenSpec workflow for spec-driven development
- **[openspec/project.md](../openspec/project.md)** - Project conventions and standards

### For Developers

- **[README.md](../README.md)** - Project overview and getting started
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history and changes

## Documentation Structure

### guides/

Step-by-step guides for creating Claude Code enhancements.

- **[skill-development.md](guides/skill-development.md)** - RED-GREEN-REFACTOR methodology, skill format, patterns
- **[skill-activation.md](guides/skill-activation.md)** - Skill auto-activation system guide
- **[plugin-configuration.md](guides/plugin-configuration.md)** - Plugin configuration and customization guide
- [creating-plugins.md](guides/creating-plugins.md) - How to create new plugins _(coming soon)_

### workflows/

Development process documentation.

- **[development.md](workflows/development.md)** - Development commands and setup
- **[openspec.md](workflows/openspec.md)** - OpenSpec workflow for proposals
- **[project.md](workflows/project.md)** - Versioning, changelog, archiving, releases
- **[git/github-flow.md](workflows/git/github-flow.md)** - Git workflow and branching strategy
- **[git/commit-conventions.md](workflows/git/commit-conventions.md)** - Commit conventions (conventional commits + gitmoji)

### standards/

Quality and coding standards.

- **[plugin-structure.md](standards/plugin-structure.md)** - Naming conventions, directory structure, validation
- **[testing.md](standards/testing.md)** - Testing philosophy, file generation rules, component testing
- **[markdown.md](standards/markdown.md)** - Markdown formatting rules (MD040, MD032, etc.)
- [coding.md](standards/coding.md) - TypeScript/JavaScript coding standards _(coming soon)_
- [accessibility.md](standards/accessibility.md) - WCAG AAA guidelines _(coming soon)_

### architecture/

Architecture decisions and technical designs.

- **[INDEX.md](architecture/INDEX.md)** - Architecture Decision Records (ADRs) catalog
- **[README.md](architecture/README.md)** - ADR usage guide
- **[decisions/](architecture/decisions/)** - Strategic architectural decisions (7 ADRs)
- **[designs/](architecture/designs/)** - Detailed technical design documents

## Key Resources by Topic

### Getting Started

1. Read [README.md](../README.md) for project overview
2. Review [openspec/project.md](../openspec/project.md) for conventions
3. Check [architecture/INDEX.md](architecture/INDEX.md) for strategic decisions

### Creating Skills

1. Read [guides/skill-development.md](guides/skill-development.md) for RED-GREEN-REFACTOR methodology
2. Review [standards/plugin-structure.md](standards/plugin-structure.md) for naming conventions
3. Check [guides/skill-activation.md](guides/skill-activation.md) for auto-activation
4. Use skill-creator from meta plugin to scaffold
5. Follow [standards/markdown.md](standards/markdown.md) for documentation

### Contributing

1. Review [workflows/git/github-flow.md](workflows/git/github-flow.md) for branching strategy
2. Follow [workflows/git/commit-conventions.md](workflows/git/commit-conventions.md) for commit format
3. Check [openspec/AGENTS.md](../openspec/AGENTS.md) for proposals
4. See [workflows/project.md](workflows/project.md) for versioning and releases

### Architecture Decisions

1. Browse [architecture/INDEX.md](architecture/INDEX.md) for all ADRs
2. Read [architecture/README.md](architecture/README.md) for ADR workflow
3. Reference ADRs in OpenSpec proposals

## External Links

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [OpenSpec](https://github.com/openspec-dev/openspec)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [gitmoji](https://gitmoji.dev/)

## Document Status

- ✅ **Complete** - Fully documented and up-to-date
- 🚧 **In Progress** - Being written or updated
- 📝 **Coming Soon** - Planned but not yet created

### Current Status

**guides/**

- ✅ skill-development.md
- ✅ skill-activation.md
- ✅ plugin-configuration.md
- 📝 creating-plugins.md

**workflows/**

- ✅ project.md
- ✅ development.md
- ✅ openspec.md
- ✅ git/github-flow.md
- ✅ git/commit-conventions.md

**standards/**

- ✅ plugin-structure.md
- ✅ testing.md
- ✅ markdown.md
- 📝 coding.md
- 📝 accessibility.md

**architecture/**

- ✅ decisions/ (13 ADRs)
- ✅ designs/plugin-distribution.md
- ✅ INDEX.md
- ✅ README.md

## Need Help?

- **For AI assistants**: See [CLAUDE.md](../CLAUDE.md) and [openspec/AGENTS.md](../openspec/AGENTS.md)
- **For developers**: Check relevant sections above
- **For contributors**: See [workflows/](workflows/) directory
- **For architecture questions**: See [architecture/](architecture/) directory
