# Unified Plugin Configuration System

## Why

Users need a discoverable, version-controllable way to configure plugin behavior (skills and hooks) without relying on environment variables or modifying plugin code. Claude Code's settings.json rejects custom fields via schema validation, requiring a separate configuration system.

## What Changes

- Create `super-claude-config.json` configuration format for plugins
- Each plugin ships with default configuration in `plugins/{plugin}/super-claude-config.json`
- Users can override settings in `.claude/super-claude-config.json` (one file total, organized by plugin name)
- Configuration supports both skills (auto-activation rules) and hooks (behavior customization)
- Deep merge strategy: Plugin defaults → Project overrides → Environment variables
- Migrate existing `skill-rules.json` to new unified format (backwards compatible during transition)
- Create shared configuration loader utility
- Add JSON schema validation for configuration files

## Impact

**Affected specs:**

- `skill-activation` - Update to read from `super-claude-config.json` instead of `skill-rules.json`
- `plugin-configuration` - New capability for unified configuration system

**Affected code:**

- `plugins/*/skill-rules.json` - Migrate to `super-claude-config.json` with `skills` wrapper
- `plugins/workflow/hooks/skill-activation.ts` - Update to read new config format
- `plugins/workflow/hooks/utils/config-loader.ts` - Update to support unified config
- `plugins/workflow/hooks/git-commit-guard.ts` - Read configuration instead of hardcoded values
- `plugins/workflow/hooks/branch-name-validator.ts` - Read configuration for customization
- `plugins/workflow/hooks/type-checker.ts` - Read configuration for timeout settings
- `.claude/super-claude-config.json` - New project-level override file (user-created)

**Related ADRs:**

- [ADR-0012: Unified Plugin Configuration System](../../docs/architecture/decisions/ADR-0012-unified-plugin-configuration.md) - Architectural decision for this configuration approach
- [ADR-0007: Skill Auto-Activation](../../docs/architecture/decisions/ADR-0007-skill-auto-activation.md) - Original skill-rules.json design being migrated
