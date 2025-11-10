---
name: configure-activation
description: Generate or update project-level plugin configuration with smart migration
version: 2.0.0
---

# Configure Plugin Activation

This command helps you set up `.claude/super-claude-config.json` for customizing plugin behavior (skills and hooks).

## What This Does

Creates or updates `.claude/super-claude-config.json` with configuration for:

- **Skills** - Auto-activation triggers, enable/disable
- **Hooks** - Behavior customization (protected branches, timeouts, etc.)
- **All installed plugins** - Unified configuration in one file

## Your Task

Execute this workflow intelligently based on what configuration files exist:

### Step 1: Detect Existing Configuration

Check for these files:

- **New format**: `.claude/super-claude-config.json`
- **Legacy format**: `.claude/skills/skill-rules.json`

### Step 2: Determine Strategy (Smart Routing)

**CASE 1: No configuration files exist (Clean Slate)**

- Generate `.claude/super-claude-config.json` from all plugin defaults
- No questions needed, just create it
- Skip to Step 4 (Generation)

**CASE 2: Only legacy config exists**

Use AskUserQuestion:

```json
{
  "questions": [
    {
      "question": "Found legacy skill-rules.json configuration. How should we handle it?",
      "header": "Migration",
      "multiSelect": false,
      "options": [
        {
          "label": "Migrate to new format",
          "description": "Convert to super-claude-config.json and create backup (.bak file)"
        },
        {
          "label": "Keep legacy format",
          "description": "Create new config separately (both will work, legacy shows deprecation warning)"
        }
      ]
    }
  ]
}
```

Actions based on answer:

- **"Migrate to new format"**: Follow Migration workflow (Step 3a)
- **"Keep legacy format"**: Generate new config only, don't touch legacy (Step 4)

**CASE 3: Only new config exists**

Check if new plugin defaults are available:

```typescript
// Pseudo-code logic
const current = loadJson('.claude/super-claude-config.json');
const allPluginDefaults = discoverPluginDefaults(); // from plugins/*/super-claude-config.json
const newAdditions = computeNewAdditions(current, allPluginDefaults);

if (newAdditions.isEmpty()) {
  // No updates needed
  console.log('✓ Configuration is up to date (all plugins configured)');
  return;
}
```

If new defaults found, use AskUserQuestion:

```json
{
  "questions": [
    {
      "question": "Found ${count} new configuration options. Add them to your config?",
      "header": "Update",
      "multiSelect": false,
      "options": [
        {
          "label": "Add new defaults",
          "description": "Add ${summary} while preserving all your customizations"
        },
        {
          "label": "Skip for now",
          "description": "Don't update (you can run /configure-activation again later)"
        }
      ]
    }
  ]
}
```

Actions based on answer:

- **"Add new defaults"**: Merge new defaults (Step 3b)
- **"Skip for now"**: Exit without changes

**CASE 4: Both configs exist**

Use AskUserQuestion:

```json
{
  "questions": [
    {
      "question": "Both legacy and new configuration files exist. What should we do?",
      "header": "Conflict",
      "multiSelect": false,
      "options": [
        {
          "label": "Merge into new config",
          "description": "Import legacy overrides into super-claude-config.json (creates backup)"
        },
        {
          "label": "Update new config only",
          "description": "Ignore legacy file and just update super-claude-config.json"
        },
        {
          "label": "Keep both separate",
          "description": "Don't merge (both will be loaded, legacy shows deprecation warning)"
        }
      ]
    }
  ]
}
```

Actions based on answer:

- **"Merge into new config"**: Migration + merge workflow (Step 3a)
- **"Update new config only"**: Update new config, ignore legacy (Step 3b)
- **"Keep both separate"**: Exit without changes

### Step 3a: Migration Workflow

**Convert legacy skill-rules.json to new format:**

```typescript
function migrateLegacyConfig(legacyPath: string): ProjectConfig {
  const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
  const migrated: ProjectConfig = {};

  // Legacy format has:
  // - plugin.namespace (e.g., "meta")
  // - skills.{skillName}
  // - overrides.disabled (array of "namespace/skillName")

  const namespace = legacy.plugin.namespace;

  if (!migrated[namespace]) {
    migrated[namespace] = { skills: {}, hooks: {} };
  }

  // Convert disabled skills
  if (legacy.overrides?.disabled) {
    for (const fullName of legacy.overrides.disabled) {
      const [ns, skillName] = fullName.split('/');
      if (ns === namespace) {
        migrated[namespace].skills[skillName] = { enabled: false };
      }
    }
  }

  // Convert skill overrides (if any custom triggers, priorities, etc.)
  for (const [skillName, skillData] of Object.entries(legacy.skills || {})) {
    if (!migrated[namespace].skills[skillName]) {
      migrated[namespace].skills[skillName] = {};
    }

    // Preserve custom triggers if they exist
    if (skillData.promptTriggers) {
      migrated[namespace].skills[skillName].triggers = {
        keywords: skillData.promptTriggers.keywords || [],
        patterns: skillData.promptTriggers.intentPatterns || [],
      };
    }
  }

  return migrated;
}
```

**Workflow:**

1. Read `.claude/skills/skill-rules.json`
2. Convert to new format using migration logic above
3. Create backup: `cp .claude/skills/skill-rules.json .claude/skills/skill-rules.json.bak`
4. Load all plugin defaults
5. Deep merge: `plugin defaults → migrated overrides → existing new config (if any)`
6. Write to `.claude/super-claude-config.json`

### Step 3b: Update Existing Config

**Add only NEW plugins/hooks while preserving ALL user customizations:**

```typescript
function addNewDefaults(
  current: ProjectConfig,
  allDefaults: Record<string, PluginConfig>,
): ProjectConfig {
  const result = { ...current };

  for (const [pluginName, pluginDefaults] of Object.entries(allDefaults)) {
    if (!result[pluginName]) {
      // Brand new plugin - add entire config
      result[pluginName] = {
        skills: pluginDefaults.skills || {},
        hooks: pluginDefaults.hooks || {},
      };
    } else {
      // Existing plugin - add only NEW skills/hooks

      // Add new skills
      if (pluginDefaults.skills) {
        result[pluginName].skills = result[pluginName].skills || {};
        for (const [skillName, skillConfig] of Object.entries(
          pluginDefaults.skills,
        )) {
          if (!result[pluginName].skills[skillName]) {
            // Only add if doesn't exist (preserve user customizations)
            result[pluginName].skills[skillName] = skillConfig;
          }
        }
      }

      // Add new hooks
      if (pluginDefaults.hooks) {
        result[pluginName].hooks = result[pluginName].hooks || {};
        for (const [hookName, hookConfig] of Object.entries(
          pluginDefaults.hooks,
        )) {
          if (!result[pluginName].hooks[hookName]) {
            // Only add if doesn't exist (preserve user customizations)
            result[pluginName].hooks[hookName] = hookConfig;
          }
        }
      }
    }
  }

  return result;
}
```

### Step 4: Generate Configuration

**Discover all plugin defaults:**

```typescript
function discoverPluginDefaults(): Record<string, PluginConfig> {
  const plugins = {};
  const pluginDirs = fs.readdirSync('plugins');

  for (const pluginName of pluginDirs) {
    const configPath = `plugins/${pluginName}/super-claude-config.json`;

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      // Extract skills and hooks for project-level format
      plugins[pluginName] = {
        skills: config.skills || {},
        hooks: config.hooks || {},
      };
    }
  }

  return plugins;
}
```

**Write with helpful comments:**

```json
{
  "$schema": "../../.claude-plugin/super-claude-config.schema.json",

  "workflow": {
    "skills": {},
    "hooks": {
      "gitCommitGuard": {
        "enabled": true,
        "protectedBranches": ["main", "master"],
        "bypassEnvVar": "SKIP_COMMIT_GUARD"
      },
      "branchNameValidator": {
        "enabled": true,
        "allowedPrefixes": [
          "feat",
          "fix",
          "chore",
          "docs",
          "test",
          "refactor",
          "perf",
          "build",
          "ci",
          "revert",
          "style"
        ],
        "allowedBranches": ["main", "master", "develop"]
      }
    }
  },

  "meta": {
    "skills": {
      "skill-creator": { "enabled": true },
      "hook-creator": { "enabled": true }
    },
    "hooks": {}
  }
}
```

Add helpful header comments explaining:

- Configuration priority: this file > plugin defaults > environment variables
- How to customize (set `enabled: false`, change arrays, add fields)
- Link to documentation

### Step 5: Show Summary

Provide clear feedback based on what was done:

**For clean slate generation:**

```txt
✓ Created .claude/super-claude-config.json

Configured ${pluginCount} plugins:
  • workflow (${skillCount} skills, ${hookCount} hooks)
  • meta (${skillCount} skills, ${hookCount} hooks)
  ...

Next steps:
  1. Open .claude/super-claude-config.json
  2. Customize settings for your project
  3. Changes take effect immediately (no restart needed)

Common customizations:
  • Disable skill: Set "enabled": false
  • Change protected branches: Modify workflow.hooks.gitCommitGuard.protectedBranches
  • Add branch prefixes: Modify workflow.hooks.branchNameValidator.allowedPrefixes

Documentation: See docs/guides/plugin-configuration.md
```

**For migration:**

```txt
✓ Migrated legacy configuration

Actions taken:
  • Created backup: .claude/skills/skill-rules.json.bak
  • Migrated overrides → .claude/super-claude-config.json
  • Merged with plugin defaults

Your customizations were preserved:
  - meta/skill-creator: disabled
  - Custom triggers for hook-creator

You can safely delete .claude/skills/skill-rules.json after verification.
The new config will be loaded automatically.
```

**For update:**

```txt
✓ Updated .claude/super-claude-config.json

Added new defaults:
  + Plugin: testing (3 skills, 2 hooks)
  + Hook: workflow/sessionChecklist
  + Hook: workflow/typeChecker

Your existing customizations were preserved:
  - workflow/gitCommitGuard.protectedBranches: ["main", "production"]
  - meta/skill-creator.enabled: false
```

**For up-to-date:**

```txt
✓ Configuration is up to date

All ${pluginCount} installed plugins are configured.
No new defaults available.

To reset to plugin defaults: Delete .claude/super-claude-config.json and run this command again.
```

## Error Handling

1. **Cannot create .claude/ directory**
   - Check permissions
   - Suggest: `chmod +w .claude`

2. **Plugin defaults not found**
   - List plugins with missing configs
   - Suggest: Check plugin installation

3. **Invalid JSON in existing config**
   - Show parse error
   - Offer to backup and regenerate

4. **File write fails**
   - Show specific error
   - Check disk space and permissions

## Important Notes

- **Always preserve user customizations** - Never overwrite unless user explicitly confirms
- **Create backups** - Always create `.bak` files before modifying
- **Deep merge strategy** - User values always win over defaults
- **Idempotent** - Safe to run multiple times
- **No restart needed** - Config loader reads on every hook execution

## Testing Checklist

After implementation, verify:

- [ ] Clean slate generation works
- [ ] Legacy migration creates backup
- [ ] Update adds only new defaults
- [ ] Conflict resolution offers all choices
- [ ] User customizations are never lost
- [ ] AskUserQuestion shows clear options
- [ ] Summary messages are accurate
- [ ] Generated JSON is valid and formatted
