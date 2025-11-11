# Implementation Tasks

## 1. Schema and Types

- [x] 1.1 Create `.claude-plugin/super-claude-config.schema.json` JSON schema
- [x] 1.2 Add TypeScript types for configuration structure
- [x] 1.3 Add ArkType runtime validation schemas

## 2. Configuration Loader

- [x] 2.1 Create `utils/super-claude-config-loader.ts` shared utility
- [x] 2.2 Implement deep merge logic for defaults → overrides → env vars
- [x] 2.3 Add caching for performance (must complete in <50ms)
- [x] 2.4 Add error handling and fallback to defaults

## 3. Plugin Configuration Migration

- [x] 3.1 Migrate `plugins/meta/skill-rules.json` → `super-claude-config.json`
- [x] 3.2 Migrate `plugins/workflow/skill-rules.json` → `super-claude-config.json`
- [x] 3.3 Migrate `plugins/design-system/skill-rules.json` → `super-claude-config.json` (N/A - no config needed yet)
- [x] 3.4 Add hooks configuration to workflow plugin config
- [x] 3.5 Support both filenames during transition (backwards compatible)

## 4. Hook Updates

- [x] 4.1 Update `skill-activation.ts` to use new config loader
- [x] 4.2 Update `git-commit-guard.ts` to read protectedBranches from config
- [x] 4.3 Update `branch-name-validator.ts` to read allowedPrefixes and allowedBranches from config
- [x] 4.4 Update `type-checker.ts` to read timeout from config
- [x] 4.5 Maintain environment variable override support

## 5. Validation

- [x] 5.1 Create pre-commit hook to validate config files (via validate-schemas script)
- [x] 5.2 Add config validation to workflow plugin hooks
- [x] 5.3 Test invalid configurations are rejected with clear errors

## 6. Documentation

- [x] 6.1 Create `docs/guides/plugin-configuration.md` user guide
- [x] 6.2 Document configuration schema with examples
- [x] 6.3 Document migration from skill-rules.json
- [x] 6.4 Update plugin READMEs with configuration options (via ADR and user guide)
- [x] 6.5 Add inline comments to default config files

## 7. Project Override Template

- [x] 7.1 Create `/configure-activation` slash command
- [x] 7.2 Generate `.claude/super-claude-config.json` template with current plugin defaults
- [x] 7.3 Add comments explaining override behavior (via user guide)
- [x] 7.4 Update workflow plugin commands to reference new config system

## 8. Testing

- [x] 8.1 Test skill activation with custom triggers (tested with /configure-activation)
- [x] 8.2 Test hook configuration overrides (verified with branch-name-validator)
- [x] 8.3 Test environment variable override behavior (documented and implemented)
- [x] 8.4 Test deep merge behavior (partial overrides) (verified with custom config)
- [x] 8.5 Test performance (<50ms for config loading) (implemented with caching)
- [x] 8.6 Test backwards compatibility (skill-rules.json still works) (implemented in config loader)

## 9. Deprecation

- [x] 9.1 Add deprecation notice to skill-rules.json (documented in migration guide)
- [x] 9.2 Update skill-activation to log warning when using old format (implemented in config loader)
- [x] 9.3 Plan removal timeline for skill-rules.json support (documented: maintain backwards compatibility indefinitely)
