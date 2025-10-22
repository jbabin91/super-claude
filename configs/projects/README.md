# Project Configurations

This directory contains **project-specific configuration templates** for super-claude.

## Overview

- **Templates only** - These are examples, not active configs
- **Plugin-based** - Install plugins via `/plugin install <plugin-name>`
- **Project-local skills** - Create in `<project>/.claude/skills/` for project-specific customizations

## Quick Start

```bash
# Install plugins from super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install plugins you need
/plugin install skill-tools          # Meta-tools for creating skills
/plugin install typescript-tools     # TypeScript development
/plugin install testing-tools        # Testing automation

# For project-specific skills, create them in your project
cd ~/code/my-project
mkdir -p .claude/skills
# Use skill-creator to generate project-specific skills
```

## Configuration Format

```json
{
  "project": "project-name",
  "description": "Brief description of project and its needs",
  "inheritGlobal": true,

  "skills": ["category/skill-name"],

  "exclude": ["category/unwanted-skill"],

  "agents": ["agent-name"]
}
```

## Examples Available

- **personal-project.json.example** - Example configuration structure

> **Note:** With the plugin system, these configs are now primarily for reference. Install plugins directly using `/plugin install` commands instead.

## Project-Specific Skills

For skills that are specific to one project:

```bash
# Create project-specific skills directory
cd ~/code/my-project
mkdir -p .claude/skills

# Use skill-creator to generate skills
# The skill will be available only in this project
```

## Best Practices

1. **Descriptive names** - Use actual project name for config file
2. **Start with examples** - Copy closest example and modify
3. **Document reasoning** - Add comments explaining skill choices
4. **Keep it focused** - Only add skills you actually use
5. **Review periodically** - Remove unused skills, add new ones

## Plugin Installation Reference

Plugins are installed via Claude Code commands:

```bash
# Install specific plugins
/plugin install typescript-tools     # TypeScript skills
/plugin install testing-tools        # Testing skills
/plugin install git-tools           # Git workflow skills
/plugin install frontend-tools      # React/frontend skills
/plugin install devops-tools        # DevOps automation
/plugin install skill-tools         # Meta-tools for creating skills
```

## Notes

- **Plugin-based architecture** - No manual configuration files needed
- **Project-local skills** - Create in `<project>/.claude/skills/` for project-specific needs
- **Global skills** - Install plugins globally via `/plugin install`
- **Config examples** - Kept for reference and advanced use cases
