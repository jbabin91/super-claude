# Plugin Configuration Guide

Complete guide to customizing super-claude plugin behavior using `super-claude-config.json`.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Configuration Structure](#configuration-structure)
- [Configuration Priority](#configuration-priority)
- [Using the Configure Command](#using-the-configure-command)
- [Common Customizations](#common-customizations)
- [Migration from Legacy Format](#migration-from-legacy-format)
- [Advanced Usage](#advanced-usage)
- [Troubleshooting](#troubleshooting)

## Overview

Super-claude uses a unified configuration system that allows you to customize:

- **Skills** - Auto-activation triggers, enable/disable
- **Hooks** - Behavior customization (protected branches, timeouts, etc.)
- **All plugins** - One configuration file for everything

### Why Use Configuration?

**Without configuration:**

- Protected branches hardcoded to `["main", "master"]`
- Branch prefixes fixed to conventional commit types
- Can't disable specific hooks or skills
- Same settings for all projects

**With configuration:**

- Customize protected branches per project
- Add project-specific branch prefixes
- Disable skills you don't use
- Different settings for work vs personal projects

## Quick Start

### Option 1: Generate Configuration (Recommended)

Use the `/workflow:configure` command:

```txt
/workflow:configure
```

This will:

1. Detect existing configuration
2. Ask about migration if needed
3. Generate `.claude/super-claude-config.json` with all plugin defaults
4. Provide helpful comments and examples

### Option 2: Manual Creation

Create `.claude/super-claude-config.json`:

```json
{
  "$schema": "../.claude-plugin/super-claude-config.schema.json",
  "workflow": {
    "skills": {},
    "hooks": {
      "gitCommitGuard": {
        "enabled": true,
        "protectedBranches": ["main", "master"]
      }
    }
  }
}
```

## Configuration Structure

### File Locations

**Plugin defaults** (shipped with plugins):

```txt
plugins/workflow/super-claude-config.json
plugins/meta/super-claude-config.json
```

**Project overrides** (your customizations):

```txt
.claude/super-claude-config.json
```

### Project Configuration Format

```json
{
  "$schema": "../.claude-plugin/super-claude-config.schema.json",

  "pluginName": {
    "skills": {
      "skillName": {
        "enabled": true,
        "triggers": {
          "keywords": ["keyword1", "keyword2"],
          "patterns": ["regex1", "regex2"]
        }
      }
    },
    "hooks": {
      "hookName": {
        "enabled": true,
        "customSetting": "value"
      }
    }
  }
}
```

### Schema Validation

Configuration files are validated against `.claude-plugin/super-claude-config.schema.json`. Invalid configurations will show clear error messages.

## Configuration Priority

Settings are loaded in this order (highest to lowest):

```txt
1. Environment Variables (highest priority)
   ↓
2. Project Config (.claude/super-claude-config.json)
   ↓
3. Plugin Defaults (plugins/*/super-claude-config.json)
```

**Example:**

```txt
Plugin default: protectedBranches = ["main", "master"]
Project config: protectedBranches = ["main", "production"]
Environment:    (none)

Result: ["main", "production"] ✓ (project config wins)
```

With environment variable:

```bash
export CLAUDE_HOOK_GIT_COMMIT_GUARD_ENABLED=false
```

```txt
Plugin default: enabled = true
Project config: enabled = true
Environment:    enabled = false

Result: false ✓ (environment wins)
```

## Using the Configure Command

The `/workflow:configure` command intelligently handles different scenarios:

### Scenario 1: No Configuration (Clean Slate)

```txt
You: /workflow:configure

Claude: ✓ Created .claude/super-claude-config.json

Configured 2 plugins:
  • workflow (0 skills, 4 hooks)
  • meta (6 skills, 0 hooks)

Next steps:
  1. Open .claude/super-claude-config.json
  2. Customize settings for your project
```

**Result:** Generates configuration with all plugin defaults.

### Scenario 2: Legacy Config Exists

```txt
You: /workflow:configure

Claude: [Shows AskUserQuestion prompt]
  Question: "Found legacy skill-rules.json configuration. How should we handle it?"
  Options:
    ○ Migrate to new format (recommended)
    ○ Keep legacy format

You: [Select "Migrate to new format"]

Claude: ✓ Migrated legacy configuration

Actions taken:
  • Created backup: .claude/skills/skill-rules.json.bak
  • Migrated overrides → .claude/super-claude-config.json
  • Merged with plugin defaults

Your customizations were preserved:
  - meta/skill-creator: disabled
```

**Result:** Migrates legacy config with backup, preserves customizations.

### Scenario 3: Updates Available

```txt
You: /workflow:configure

Claude: [Shows AskUserQuestion prompt]
  Question: "Found 3 new configuration options. Add them to your config?"
  Options:
    ○ Add new defaults
    ○ Skip for now

You: [Select "Add new defaults"]

Claude: ✓ Updated .claude/super-claude-config.json

Added new defaults:
  + Plugin: testing (3 skills, 2 hooks)
  + Hook: workflow/sessionChecklist

Your existing customizations were preserved.
```

**Result:** Adds only new plugins/hooks, preserves your customizations.

### Scenario 4: Already Up to Date

```txt
You: /workflow:configure

Claude: ✓ Configuration is up to date

All 2 installed plugins are configured.
No new defaults available.
```

**Result:** No changes needed.

## Common Customizations

### Disable a Skill

```json
{
  "meta": {
    "skills": {
      "skill-creator": {
        "enabled": false
      }
    }
  }
}
```

### Change Protected Branches

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "enabled": true,
        "protectedBranches": ["main", "production", "staging"]
      }
    }
  }
}
```

### Customize Branch Prefixes

```json
{
  "workflow": {
    "hooks": {
      "branchNameValidator": {
        "enabled": true,
        "allowedPrefixes": ["feature", "bugfix", "hotfix"],
        "allowedBranches": ["main", "develop"]
      }
    }
  }
}
```

### Add Custom Skill Triggers

```json
{
  "meta": {
    "skills": {
      "skill-creator": {
        "enabled": true,
        "triggers": {
          "keywords": ["create skill", "generate skill", "scaffold skill"],
          "patterns": ["(make|build|create).*skill"]
        }
      }
    }
  }
}
```

### Change Hook Timeout

```json
{
  "workflow": {
    "hooks": {
      "typeChecker": {
        "enabled": true,
        "timeout": 5000
      }
    }
  }
}
```

### Disable All Hooks in a Plugin

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": { "enabled": false },
      "branchNameValidator": { "enabled": false },
      "typeChecker": { "enabled": false },
      "sessionChecklist": { "enabled": false }
    }
  }
}
```

## Migration from Legacy Format

### Legacy Format (`.claude/skills/skill-rules.json`)

```json
{
  "plugin": {
    "namespace": "meta",
    "name": "Meta Tools"
  },
  "overrides": {
    "disabled": ["meta/skill-creator"]
  },
  "skills": {
    "skill-creator": {
      "promptTriggers": {
        "keywords": ["custom keyword"]
      }
    }
  }
}
```

### New Format (`.claude/super-claude-config.json`)

```json
{
  "meta": {
    "skills": {
      "skill-creator": {
        "enabled": false,
        "triggers": {
          "keywords": ["custom keyword"]
        }
      }
    }
  }
}
```

### Migration Steps

1. **Automatic (Recommended):**

   ```txt
   Run: /workflow:configure
   Select: "Migrate to new format"
   ```

2. **Manual:**
   - Copy settings from legacy file
   - Convert structure to new format
   - Create `.claude/super-claude-config.json`
   - Delete or backup legacy file

### What Gets Migrated

- ✅ Disabled skills → `enabled: false`
- ✅ Custom keywords → `triggers.keywords`
- ✅ Custom patterns → `triggers.patterns`
- ✅ Plugin namespace → top-level key

### What Doesn't Migrate

- ❌ Priority settings (not used in new system)
- ❌ Global settings (not applicable to new format)

## Advanced Usage

### Per-Project Configuration

**Personal Project:**

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "protectedBranches": ["main"]
      }
    }
  }
}
```

**Work Project:**

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "protectedBranches": ["main", "master", "production", "staging"]
      }
    }
  }
}
```

### Environment Variable Overrides

**Temporary Disable:**

```bash
export CLAUDE_HOOK_TYPE_CHECKER_ENABLED=false
```

**Custom Bypass Variable:**

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "bypassEnvVar": "EMERGENCY_DEPLOY"
      }
    }
  }
}
```

Then use:

```bash
EMERGENCY_DEPLOY=true git commit -m "hotfix"
```

### Deep Merge Behavior

**Plugin Default:**

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "enabled": true,
        "protectedBranches": ["main", "master"],
        "bypassEnvVar": "SKIP_COMMIT_GUARD"
      }
    }
  }
}
```

**Project Override:**

```json
{
  "workflow": {
    "hooks": {
      "gitCommitGuard": {
        "protectedBranches": ["main", "production"]
      }
    }
  }
}
```

**Result:**

```json
{
  "enabled": true, // From plugin default
  "protectedBranches": ["main", "production"], // From project override
  "bypassEnvVar": "SKIP_COMMIT_GUARD" // From plugin default
}
```

**Key points:**

- Only specified fields are overridden
- Other fields use plugin defaults
- Arrays are replaced entirely (not merged)

### Validation and Debugging

**Check configuration is valid:**

```bash
# Configuration is validated on every load
# Errors appear in hook debug output
```

**View merged configuration:**

Hook debug output shows:

```txt
[DEBUG] workflow:gitCommitGuard enabled=true (from config)
[DEBUG] Protected branches: main, production
```

### Performance

- **Caching:** Configuration is cached after first load
- **Target:** <50ms load time
- **Reload:** Cache is per-session, no manual reload needed

## Troubleshooting

### Configuration Not Taking Effect

**Check file location:**

```bash
ls -la .claude/super-claude-config.json
```

Should be in project root's `.claude/` directory.

**Check JSON syntax:**

```bash
cat .claude/super-claude-config.json | jq .
```

If invalid, shows parse error.

**Check schema:**

```json
{
  "$schema": "../.claude-plugin/super-claude-config.schema.json"
}
```

### Hook Still Using Default Values

**Possible causes:**

1. **Typo in plugin/hook name:**

   ```json
   // ❌ Wrong
   { "workflows": { "hooks": { ... } } }

   // ✅ Correct
   { "workflow": { "hooks": { ... } } }
   ```

2. **Environment variable override:**

   ```bash
   # Check for env vars
   env | grep CLAUDE_HOOK
   ```

3. **Configuration cache:**

   Restart Claude Code session to clear cache.

### Validation Errors

**Example error:**

```txt
[ERROR] Invalid project config:
Configuration validation failed:
  workflow.hooks.gitCommitGuard.protectedBranches must be array
```

**Fix:**

```json
// ❌ Wrong
{ "protectedBranches": "main" }

// ✅ Correct
{ "protectedBranches": ["main"] }
```

### Legacy Config Not Migrating

**Check file exists:**

```bash
ls -la .claude/skills/skill-rules.json
```

**Run migration:**

```txt
/workflow:configure
Select: "Migrate to new format"
```

**Check backup was created:**

```bash
ls -la .claude/skills/skill-rules.json.bak
```

### Configuration File Ignored

**Check .gitignore:**

`.claude/super-claude-config.json` should **NOT** be in `.gitignore`. This file should be committed to share configuration with your team.

**Files to ignore:**

- `.claude/settings.local.json` ✅ (personal settings)
- `.claude/super-claude-config.json` ❌ (team configuration)

## Best Practices

### ✅ Do

- **Commit configuration** - Share settings with your team
- **Use `/workflow:configure`** - Easiest way to generate config
- **Start minimal** - Only override what you need
- **Add comments** - JSON comments aren't allowed, but use git commit messages
- **Test changes** - Verify hooks behave as expected

### ❌ Don't

- **Hardcode secrets** - Never put tokens or passwords in config
- **Override everything** - Only customize what differs from defaults
- **Ignore validation errors** - Fix schema issues immediately
- **Skip backups** - Always let `/workflow:configure` create backups

## Further Reading

- [ADR-0012: Unified Plugin Configuration](../architecture/decisions/ADR-0012-unified-plugin-configuration.md)
- [Skill Activation Guide](./skill-activation.md)
- [Command Hooks Guide](./command-hooks.md)
- [OpenSpec: Plugin Configuration](../../openspec/changes/add-unified-plugin-config/proposal.md)

## Need Help?

- **View plugin defaults:** Check `plugins/{plugin}/super-claude-config.json`
- **Schema reference:** See `.claude-plugin/super-claude-config.schema.json`
- **Ask questions:** Open an issue at [super-claude repository](https://github.com/jbabin91/super-claude/issues)
