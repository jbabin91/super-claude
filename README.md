# super-claude

> Claude Code, supercharged. 🚀

A comprehensive collection of skills, agents, hooks, and utilities to enhance your Claude Code workflow. Inspired by [obra/superpowers](https://github.com/obra/superpowers) and battle-tested across TypeScript, React, and Node.js projects.

## ✨ What's Inside

- **Skills** - Reusable capabilities that auto-activate based on context
- **Agents** - Specialized Claude instances for specific tasks
- **Hooks** - Session lifecycle automation
- **Commands** - Custom slash commands for workflows
- **Templates** - Quick-start patterns for creating enhancements

## 🚀 Quick Start

### Installation

```bash
# Option 1: Install from marketplace (recommended)
/plugin marketplace add jbabin91/super-claude

# Then install specific plugins you need:
/plugin install skill-tools          # Meta-tools for creating skills
/plugin install typescript-tools     # TypeScript development
/plugin install testing-tools        # Testing automation
/plugin install git-tools           # Git workflows
/plugin install frontend-tools      # React/Frontend tools
/plugin install devops-tools        # DevOps automation

# Option 2: Clone and develop locally
git clone https://github.com/jbabin91/super-claude
cd super-claude
# Plugins auto-load from your local directory
```

## 📦 Available Skills

### TypeScript

- **tsc-files-validation** - CLI testing across scenarios (monorepo, package managers, cross-platform)
- **refactor-imports** - Path alias management and import organization
- **generate-tests** - Vitest test generation with proper mocking
- **fix-types** - Auto-fix common TypeScript errors

### Testing

- **vitest-integration** - Advanced Vitest workflows with dynamic test generation
- **playwright-e2e** - End-to-end testing with Playwright
- **coverage-improve** - Identify and cover untested code paths
- **monorepo-testing** - Multi-package testing strategies

### Git

- **smart-commit** - Conventional commits with gitmoji
- **pr-description** - Auto-generate PR descriptions from commits
- **changelog** - Automated changelog generation
- **worktree-helper** - Parallel development branch management

### Frontend

- **component-generator** - React functional component scaffolding
- **tailwind-helper** - Utility class optimization
- **react-patterns** - Best practices enforcement
- **storybook-story** - Component story generation

### DevOps

- **docker-compose** - Container orchestration helpers
- **env-manager** - Environment variable management
- **github-actions** - CI/CD workflow generation

## 🏗️ Project Structure

```sh
super-claude/
├── plugins/          # Plugin packages organized by category
│   ├── skill-tools/         # Meta-tools for creating skills
│   ├── typescript-tools/    # TypeScript development
│   ├── testing-tools/       # Testing automation
│   ├── git-tools/          # Git workflows
│   ├── frontend-tools/     # React/Frontend tools
│   └── devops-tools/       # DevOps automation
├── .claude-plugin/   # Marketplace configuration
├── configs/         # Configuration templates and examples
└── docs/            # Guides and best practices
```

## 🔒 Project-Specific Skills

This repo is designed for **public sharing** with generic, reusable plugins.

For project-specific or work-related skills:

- Install plugins globally: `~/.claude/skills/super-claude`
- Create project-specific skills in: `<project>/.claude/skills/`

## 📚 Documentation

- [Creating Skills](docs/CREATING_SKILLS.md) - How to build your own skills

## 🎯 Using Plugins

### Install from Marketplace

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install specific plugins
/plugin install skill-tools          # Create and manage skills
/plugin install typescript-tools     # TypeScript development
/plugin install testing-tools        # Testing automation
```

### Create Custom Skills

Use the skill-tools plugin to generate new skills:

```bash
# Install skill-tools first
/plugin install skill-tools

# Then use it to create new skills
# Skills auto-activate based on conversation context
```

See [Creating Skills](docs/CREATING_SKILLS.md) for details.

## 🤝 Contributing

Contributions welcome! Please:

1. Follow the [skill creation guide](docs/CREATING_SKILLS.md)
2. Test skills before submitting PRs
3. Keep skills focused and reusable
4. Include documentation and examples

## 📄 License

MIT © [Jace Babin](https://github.com/jbabin91)

## 🙏 Acknowledgments

Heavily inspired by:

- [obra/superpowers](https://github.com/obra/superpowers) - Battle-tested TDD and debugging workflows
- [anthropics/skills](https://github.com/anthropics/skills) - Official skill examples
- [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) - Universal executor pattern

---

**Status**: 🚧 Under active development | **Version**: 0.1.0
