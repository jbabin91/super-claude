# Plugin Structure Standards

Standards for naming conventions, directory structure, and plugin organization.

## Naming Conventions

**ALWAYS follow these naming conventions when creating plugins, skills, agents, commands, and hooks:**

### Plugins

- **Format:** `{category}` or `{category}-{purpose}` (no `-tools` suffix)
- **Examples:** `tanstack`, `api`, `database`, `auth`, `design-system`, `testing`, `git`, `typescript`
- **Special case:** `meta` (meta-tools for creating skills, commands, agents, hooks, plugins)

### Skills

- **Format:** Descriptive kebab-case name (NO `-skill` suffix)
- **Location:** `plugins/{plugin}/skills/{name}/SKILL.md`
- **Examples:**
  - `hono.md` (not `hono-skill.md`)
  - `api.md` (not `api-skill.md`)
  - `component-generator.md` (not `component-generator-skill.md`)
  - `drizzle-maestro.md` (not `drizzle-maestro-skill.md`)

### Agents

- **Format:** Descriptive kebab-case name (NO `-agent` suffix)
- **Location:** `plugins/{plugin}/agents/{name}.md`
- **Examples:**
  - `hono.md` (not `hono-agent.md`)
  - `api.md` (not `api-agent.md`)
  - `component.md` (not `component-agent.md`)

### Commands

- **Format:** Verb phrases in kebab-case (NO suffix)
- **Location:** `plugins/{plugin}/commands/{name}.md`
- **Examples:**
  - `create-hono-api.md` (not `create-hono-api-command.md`)
  - `generate-component.md`
  - `setup-auth.md`

### Hooks

- **Format:** Event-based or lifecycle names (NO suffix)
- **Location:** `plugins/{plugin}/hooks/{name}.md`
- **Examples:**
  - `pre-commit.md` (not `pre-commit-hook.md`)
  - `post-deploy.md`
  - `on-error.md`

**Rationale:** The directory structure already indicates the type (`skills/`, `agents/`, `commands/`, `hooks/`), so adding redundant suffixes like `-skill` or `-command` is unnecessary and verbose.

## Directory Structure

```sh
super-claude/
├── plugins/            # Plugin packages
│   ├── meta/          # Meta-tools (ready)
│   ├── design-system/ # Component libraries (ready)
│   ├── testing/       # Testing automation (in dev)
│   ├── typescript/    # TypeScript tools (in dev)
│   ├── git/           # Git workflows (in dev)
│   └── devops/        # DevOps (in dev)
├── .claude-plugin/    # Marketplace configuration
└── docs/              # Brainstorm sessions and decisions
```

## Plugin Directory Structure

Each plugin follows this structure:

```sh
plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest (ONLY file in this directory)
├── skills/
│   └── {skill-name}/
│       ├── SKILL.md          # Main skill instructions
│       └── API_REFERENCE.md  # Advanced details (optional)
├── agents/
│   └── {agent-name}.md       # Agent definitions
├── commands/
│   └── {command-name}.md     # Slash command implementations
└── hooks/
    ├── hooks.json            # Hook configuration (NOT in .claude-plugin/)
    └── {hook-name}.ts        # Hook script implementations
```

> **IMPORTANT:** The `.claude-plugin/` directory should ONLY contain `plugin.json`.
> All other directories (commands/, agents/, skills/, hooks/) must be at the plugin root.
> Skills, agents, and commands are auto-discovered from their directories.

## Key Files

- **openspec/changes/** - Plugin proposals with detailed skill plans
- **openspec/project.md** - Tech stack and project conventions
- **.claude-plugin/marketplace.json** - Plugin marketplace manifest
- **docs/PLUGIN_DISTRIBUTION_DESIGN.md** - Plugin architecture reference

## Auto-Activation System

**Status:** ✅ Implemented and ready to use

Skills automatically activate based on prompt keywords and intent patterns. No manual invocation required.

**Architecture:** Per-plugin `skill-rules.json` + project overrides + UserPromptSubmit hook (<50ms execution)

**For complete guide, see [skill-activation.md](../guides/skill-activation.md)**

**Quick start:**

```bash
# Generate project overrides template
/workflow:configure
```

## Privacy & Security

### Public Content

- `plugins/*` - Generic, reusable plugins with skills
- Documentation and architectural guides
- Marketplace configuration

### Project-Specific Skills

For project-specific or work-related skills:

- Install plugins from marketplace: `/plugin install <plugin-name>`
- Create project-specific skills in: `<project>/.claude/skills/`

## Plugin Manifest Schema

### plugin.json (minimal required)

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "What the plugin does",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://github.com/username"
  },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"]
}
```

> **Note:** Skills, agents, and commands are auto-discovered from their directories.
> You do NOT need to list them explicitly in plugin.json.
> Hooks at `hooks/hooks.json` are also auto-discovered.

### plugin.json (with optional explicit references)

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "What the plugin does",
  "homepage": "https://github.com/user/repo/tree/main/plugins/plugin-name",
  "repository": "https://github.com/user/repo",
  "hooks": "./hooks/hooks.json"
}
```

### hooks.json (at hooks/hooks.json)

```json
{
  "description": "Hook descriptions for this plugin",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.ts",
            "timeout": 30
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/type-checker.ts"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete: $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

**Hook Types:**

- `command` - Execute bash scripts (default timeout: 60s)
- `prompt` - LLM-based evaluation (default timeout: 30s, mainly for Stop/SubagentStop)

**Environment Variables:**

- `${CLAUDE_PLUGIN_ROOT}` - Absolute path to plugin directory
- `$CLAUDE_PROJECT_DIR` - Project root directory
- `$CLAUDE_ENV_FILE` - (SessionStart only) File path to persist environment variables

**Matcher Values by Event:**

- `PreToolUse/PostToolUse/PermissionRequest` - Tool names: `Edit`, `Write`, `Bash`, `Read`, etc.
- `Notification` - `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`
- `SessionStart` - `startup`, `resume`, `clear`, `compact`
- `PreCompact` - `manual`, `auto`

## Validation

All plugin manifests and skill frontmatter are automatically validated:

```bash
# Validate all schemas
bun run validate

# Validate only git-staged files
bun run validate:changed

# Show detailed validation output
bun run validate:verbose
```

See [hooks reference](https://code.claude.com/docs/en/hooks.md) for complete documentation.

## Related Documentation

- **[Skill Development Guide](../guides/skill-development.md)** - RED-GREEN-REFACTOR methodology, skill format, patterns
- **[Skill Activation Guide](../guides/skill-activation.md)** - Auto-activation system and triggers
- **[Testing Standards](testing.md)** - Testing philosophy, stories-based testing, file generation
- **[Plugin Configuration Guide](../guides/plugin-configuration.md)** - Configure and customize plugins
- **[Markdown Standards](markdown.md)** - Formatting rules for documentation
