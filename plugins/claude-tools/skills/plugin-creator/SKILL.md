---
name: plugin-creator
version: 1.0.0
description: |
  Create complete Claude Code plugins with proper structure including skills, commands, agents, and hooks.
  Generates plugin manifests and directory structures for distribution.
  Use when: building plugins, creating plugin packages, distributing skills to marketplace.
  Activates for: "create plugin", "generate plugin", "new plugin", "plugin package", "make plugin"
---

# Plugin Creator

Generate complete Claude Code plugins with proper structure and configuration.

## When to Use

- Creating shareable plugin packages
- Building complete tool collections
- Organizing related skills/commands/agents
- Distributing functionality to teams
- Contributing to plugin marketplaces

## Plugin Structure

A complete plugin includes:

```sh
plugin-name/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── skills/                   # Optional: Skill definitions
│   ├── skill-1.md
│   └── skill-2.md
├── commands/                 # Optional: Slash commands
│   ├── command-1.md
│   └── command-2.md
├── agents/                   # Optional: Agent definitions
│   ├── agent-1.md
│   └── agent-2.md
├── hooks/                    # Optional: Event hooks
│   └── hooks.json
├── README.md                 # Documentation
└── LICENSE                   # Optional: License file
```

## Core Workflow

### 1. Gather Requirements

Ask the user:

- **Plugin name**: Kebab-case identifier
- **Purpose**: What problem does this plugin solve?
- **Components**: What will it include (skills/commands/agents/hooks)?
- **Target audience**: Who will use this?
- **Distribution**: Public marketplace or private?
- **Dependencies**: Required tools or other plugins?

### 2. Generate Plugin Structure

#### Create Directory Structure

```bash
mkdir -p plugin-name/.claude-plugin
mkdir -p plugin-name/skills
mkdir -p plugin-name/commands
mkdir -p plugin-name/agents
mkdir -p plugin-name/hooks
```

#### Generate plugin.json

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Clear description of what this plugin does",
  "author": {
    "name": "Author Name",
    "email": "email@example.com",
    "github": "github-username"
  },
  "license": "MIT",
  "category": "appropriate-category",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "skills": ["skill-1", "skill-2"],
  "commands": ["command-1", "command-2"],
  "agents": ["agent-1", "agent-2"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/plugin-name"
  },
  "homepage": "https://github.com/username/plugin-name",
  "requires": {
    "tools": ["git", "npm"],
    "plugins": []
  }
}
```

#### Generate README.md

```markdown
# Plugin Name

> Brief description

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
/plugin marketplace add username/plugin-name
/plugin install plugin-name
\`\`\`

## Usage

### Skills

- **skill-1**: Description
- **skill-2**: Description

### Commands

- `/command-1`: Description
- `/command-2`: Description

### Agents

- **agent-1**: Description

## Examples

[Usage examples]

## Requirements

- Tool 1
- Tool 2

## License

MIT
```

### 3. Add Components

Use the creator skills to add components:

- **skill-creator**: Add skills
- **command-creator**: Add commands
- **agent-creator**: Add agents
- **hook-creator**: Add hooks

### 4. Validate Plugin

Ensure:

- ✅ plugin.json is valid JSON
- ✅ All referenced components exist
- ✅ Directory structure is correct
- ✅ README is comprehensive
- ✅ License is appropriate
- ✅ Keywords are relevant

## Example Plugins

### TanStack Tools Plugin

```sh
tanstack-tools/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── tanstack-router-setup.md
│   ├── tanstack-query-hook.md
│   ├── tanstack-form-schema.md
│   ├── tanstack-table-config.md
│   └── tanstack-start-project.md
├── commands/
│   ├── setup-tanstack-start.md
│   └── generate-query-hook.md
├── README.md
└── LICENSE
```

**plugin.json:**

```json
{
  "name": "tanstack-tools",
  "version": "1.0.0",
  "description": "Comprehensive TanStack ecosystem tools for Router, Query, Forms, Table, and Start",
  "author": {
    "name": "Jace Babin",
    "email": "jbabin91@gmail.com",
    "github": "jbabin91"
  },
  "license": "MIT",
  "category": "framework",
  "keywords": [
    "tanstack",
    "router",
    "query",
    "forms",
    "table",
    "start",
    "react"
  ],
  "skills": [
    "tanstack-router-setup",
    "tanstack-query-hook",
    "tanstack-form-schema",
    "tanstack-table-config",
    "tanstack-start-project"
  ],
  "commands": ["setup-tanstack-start", "generate-query-hook"],
  "requires": {
    "tools": ["npm", "git"],
    "packages": ["@tanstack/router", "@tanstack/react-query"]
  }
}
```

### API Tools Plugin

```sh
api-tools/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── drizzle-setup.md
│   ├── drizzle-schema-generator.md
│   ├── better-auth-setup.md
│   ├── hono-rpc-endpoint.md
│   └── elysia-setup.md
├── commands/
│   ├── init-drizzle.md
│   ├── generate-api-client.md
│   └── setup-auth.md
├── agents/
│   └── api-designer.md
├── README.md
└── LICENSE
```

**plugin.json:**

```json
{
  "name": "api-tools",
  "version": "1.0.0",
  "description": "Backend API development tools for Hono, Elysia, Drizzle, and better-auth",
  "author": {
    "name": "Jace Babin",
    "email": "jbabin91@gmail.com",
    "github": "jbabin91"
  },
  "license": "MIT",
  "category": "backend",
  "keywords": [
    "api",
    "backend",
    "hono",
    "elysia",
    "drizzle",
    "better-auth",
    "openapi"
  ],
  "skills": [
    "drizzle-setup",
    "drizzle-schema-generator",
    "better-auth-setup",
    "hono-rpc-endpoint",
    "elysia-setup"
  ],
  "commands": ["init-drizzle", "generate-api-client", "setup-auth"],
  "agents": ["api-designer"],
  "requires": {
    "tools": ["npm", "node"],
    "packages": ["drizzle-orm", "better-auth"]
  }
}
```

### Component Library Plugin

```sh
design-system-tools/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── component-generator.md
│   ├── component-a11y-validator.md
│   ├── storybook-story.md
│   └── design-tokens-validator.md
├── commands/
│   ├── create-component.md
│   ├── validate-a11y.md
│   └── generate-stories.md
├── agents/
│   ├── component-reviewer.md
│   └── a11y-auditor.md
├── hooks/
│   └── hooks.json
├── README.md
└── LICENSE
```

## Plugin Categories

### Framework-Specific

- tanstack-tools
- react-tools
- next-tools
- vue-tools

### Backend

- api-tools
- database-tools
- auth-tools

### DevOps

- deployment-tools
- ci-cd-tools
- monitoring-tools

### Code Quality

- testing-tools
- linting-tools
- security-tools

### Meta

- skill-tools (this plugin!)
- marketplace-tools
- template-tools

## Plugin Manifest Fields

### Required Fields

```json
{
  "name": "plugin-identifier", // Required: kebab-case
  "version": "1.0.0", // Required: semantic versioning
  "description": "Clear description" // Required: what it does
}
```

### Recommended Fields

```json
{
  "author": {
    "name": "Author Name",
    "email": "email@example.com",
    "github": "username"
  },
  "license": "MIT",
  "category": "framework",
  "keywords": ["keyword1", "keyword2"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/plugin"
  },
  "homepage": "https://github.com/username/plugin"
}
```

### Optional Fields

```json
{
  "skills": ["skill-1", "skill-2"], // List of included skills
  "commands": ["cmd-1", "cmd-2"], // List of commands
  "agents": ["agent-1"], // List of agents
  "requires": {
    "tools": ["git", "npm"], // Required CLI tools
    "plugins": ["other-plugin"], // Plugin dependencies
    "packages": ["package-name"] // npm package dependencies
  }
}
```

## Distribution

### Public Marketplace

1. Create GitHub repository
2. Add marketplace.json (if creating marketplace)
3. Tag releases with versions
4. Share repository URL

Users install via:

```bash
/plugin marketplace add username/plugin-name
/plugin install plugin-name
```

### Private/Work Distribution

1. Host on private Git server
2. Share repository URL with team
3. Add to team marketplace

Users install via:

```bash
/plugin marketplace add git@internal:plugins/plugin-name
/plugin install plugin-name
```

## Best Practices

1. **Clear Purpose**: Plugin should solve one specific problem domain
2. **Good Documentation**: Comprehensive README with examples
3. **Semantic Versioning**: Follow semver for releases
4. **Minimal Dependencies**: Only require what's necessary
5. **Test Before Release**: Validate all components work
6. **Helpful Keywords**: Make plugin discoverable

## Anti-Patterns

- ❌ Kitchen-sink plugins (too many unrelated features)
- ❌ Missing documentation
- ❌ No examples
- ❌ Unclear versioning
- ❌ Missing license
- ❌ Poor component organization

## Troubleshooting

### Plugin Not Loading

**Solution**:

- Validate plugin.json syntax
- Check directory structure
- Verify all referenced files exist
- Restart Claude Code

### Components Not Found

**Solution**:

- Check component names match manifest
- Verify files are in correct directories
- Check file extensions (.md for skills/commands/agents)

## References

- [Claude Code Plugins Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [super-claude Plugin Examples](../../plugins/)
- [Plugin Manifest Spec](https://docs.claude.com/en/docs/claude-code/plugins#manifest)
