# Meta Plugin

**Version:** 0.4.0
**Category:** Meta-tools
**Status:** ✅ Ready for use

## Overview

The meta plugin provides tools for creating and managing Claude Code components. It's the foundation for plugin creators and power users who want to extend Claude Code with custom skills, commands, agents, hooks, and plugins.

## Features

### Skills

The meta plugin includes 6 creation and validation skills:

#### 1. **skill-creator**

Generate new Claude Code skills with proper structure and validation.

**Auto-activates on:**

- "create skill", "new skill", "generate skill"
- Intent patterns: `(create|add|generate|build).*?skill`

**Usage:**

```text
User: "I need to create a skill for testing React components"
Claude: *activates skill-creator* Let me help you create that skill...
```

#### 2. **command-creator**

Generate slash commands for Claude Code.

**Auto-activates on:**

- "create command", "slash command", "generate command"
- Intent patterns: `(create|add|generate|build).*?command`

#### 3. **hook-creator**

Generate Claude Code hooks for workflow automation.

**Auto-activates on:**

- "create hook", "pre-commit", "post-commit"
- Intent patterns: `(create|add|generate|build).*?hook`

#### 4. **agent-creator**

Generate specialized agents for complex tasks.

**Auto-activates on:**

- "create agent", "specialized agent"
- Intent patterns: `(create|add|generate|build).*?agent`

#### 5. **plugin-creator**

Generate new Claude Code plugin structure with marketplace configuration.

**Auto-activates on:**

- "create plugin", "new plugin", "plugin scaffold"
- Intent patterns: `(create|add|generate|build).*?plugin`

#### 6. **skill-validator**

Validate skill files for correctness and best practices.

**Auto-activates on:**

- "validate skill", "check skill", "verify skill"
- Intent patterns: `(validate|check|verify|test).*?skill`

## Installation

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install the meta plugin
/plugin install meta
```

## Requirements

- Claude Code CLI
- Bun (for TypeScript hook execution, if generating hooks)

## Auto-Activation

All skills in this plugin automatically activate based on your conversation context. No manual invocation required.

**Example:**

```text
User: "I want to create a skill for managing database migrations"
Claude: *skill-creator activates automatically*
```

## Configuration

### Unified Configuration System

The meta plugin supports project-level configuration overrides via `.claude/super-claude-config.json`:

```json
{
  "$schema": "../.claude-plugin/super-claude-config.schema.json",
  "meta": {
    "skills": {
      "skill-creator": {
        "enabled": true,
        "triggers": {
          "keywords": ["create skill", "build skill", "scaffold skill"],
          "patterns": ["(create|build|scaffold).*?skill"]
        }
      }
    }
  }
}
```

**Generate configuration template:**

```bash
/workflow:configure
```

This command creates a template with current plugin defaults. You can then customize:

- Skill activation triggers (keywords and patterns)
- Enable/disable specific skills
- Adjust skill priorities

**Configuration priority:** Environment variables > Project overrides (`.claude/super-claude-config.json`) > Plugin defaults

**See also:** [Plugin Configuration Guide](../../docs/guides/plugin-configuration.md) for complete documentation.

**Legacy format:** The old `.claude/skills/skill-rules.json` format is still supported for backwards compatibility.

## Skill Naming Conventions

The meta plugin follows these naming conventions:

**Plugins:**

- Format: `{category}` or `{category}-{purpose}` (no `-tools` suffix)
- Examples: `meta`, `workflow`, `design-system`

**Skills:**

- Format: Descriptive kebab-case (NO `-skill` suffix)
- Location: `skills/{name}/SKILL.md`
- Examples: `skill-creator`, `command-creator` (not `skill-creator-skill`)

**Commands:**

- Format: Verb phrases in kebab-case (NO `-command` suffix)
- Examples: `create-api`, `generate-component`

**Hooks:**

- Format: Event-based names (NO `-hook` suffix)
- Examples: `pre-commit`, `post-deploy`

**Agents:**

- Format: Descriptive kebab-case (NO `-agent` suffix)
- Examples: `hono`, `component`

## Development Workflow

### Creating a New Skill

1. **Trigger skill-creator** in conversation:

   ```text
   "I need to create a skill for..."
   ```

2. **Follow prompts** - Claude will guide you through:
   - Skill purpose and description
   - Auto-activation triggers
   - Model selection (sonnet/haiku/opus)
   - Required tools and dependencies

3. **Review generated files**:

   ```text
   .claude/skills/{plugin}/skills/{skill-name}/
   └── SKILL.md    # Skill definition with YAML frontmatter
   ```

4. **Test the skill** - Use it in a conversation to verify behavior

5. **Iterate** - Refine activation triggers and instructions

### Best Practices

- **Progressive Disclosure** - Keep SKILL.md < 500 lines, use API_REFERENCE.md for advanced topics
- **RED-GREEN-REFACTOR** - Document failures, implement minimally, then harden
- **Auto-Activation** - Define clear keywords and intent patterns
- **Token Efficiency** - Target < 500 words for frequently-loaded skills

## Troubleshooting

### Skills Not Activating

**Check installation:**

```bash
ls -la .claude/skills/meta/
```

**Verify skill-rules.json exists:**

```bash
cat .claude/skills/meta/skills/skill-rules.json
```

**Test with explicit keywords:**

```text
"create skill for testing"  # Should activate skill-creator
```

### TypeScript Errors

If generating TypeScript hooks:

```bash
cd .claude
bun install  # Install @types/bun
```

## License

MIT

## Author

Jace Babin - [@jbabin91](https://github.com/jbabin91)

## Contributing

See the main [super-claude repository](https://github.com/jbabin91/super-claude) for contribution guidelines.
