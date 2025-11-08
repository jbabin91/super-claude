# Schema Validation System

## Why

Plugin manifest schemas are not validated before commit/push, leading to runtime errors when Claude Code loads plugins. The workflow plugin is currently broken due to an invalid hooks schema structure - we used an array format instead of the nested object structure required by Claude Code.

**Current issue:**

```txt
Plugin workflow has an invalid manifest file at
/Users/jacebabin/.claude/plugins/marketplaces/super-claude/plugins/workflow/.claude-plugin/plugin.json.

Validation errors: hooks: Invalid input
```

This breaks the entire workflow plugin and prevents all hooks from loading. We need automated validation to catch schema errors before they reach users.

## What Changes

Add comprehensive schema validation system:

1. **ArkType schema definitions** for all manifest types:
   - `plugin.json` (including inline hooks structure)
   - `marketplace.json`
   - `SKILL.md` frontmatter (YAML)

2. **Validation CLI** (`scripts/validate-schemas.ts`):
   - Validate all plugins and marketplace
   - Support `--changed` flag for git-staged files only
   - Clear error messages with file paths and expected formats
   - Exit codes for git hook integration (0 = pass, 1 = fail)

3. **Git hook integration** (via Lefthook):
   - Pre-commit: Validate changed files only (<500ms target)
   - Pre-push: Validate all schemas (<2s target)

4. **NPM scripts**:
   - `bun run validate` - Validate all schemas
   - `bun run validate:plugins` - Just plugins
   - `bun run validate:marketplace` - Just marketplace

## Impact

**Affected specs:**

- None (tooling-only change, use `--skip-specs` during archive)

**Affected code:**

- `package.json` - Add arktype dependency
- `schemas/` - New directory with ArkType schema definitions
- `scripts/validate-schemas.ts` - New validation CLI
- `.lefthook.yml` - Add validation hooks
- `package.json` - Add validation scripts

**Benefits:**

- Catches schema errors before commit
- Prevents broken plugins from reaching marketplace
- Clear error messages guide fixes
- Fast validation (<500ms for typical changes)

**Related ADRs:**

- None (infrastructure tooling)

**Related changes:**

- Blocks completion of `add-workflow-command-hooks` (need to fix broken hooks schema)
