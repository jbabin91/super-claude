# Implementation Tasks

## 1. Setup and Dependencies

- [ ] 1.1 Install ArkType: `bun add -d arktype`
- [ ] 1.2 Create `schemas/` directory
- [ ] 1.3 Create `scripts/` directory (if not exists)

## 2. Schema Definitions

- [ ] 2.1 Create `schemas/plugin.schema.ts` with ArkType schema for plugin.json
  - [ ] Core fields: name, version, description, author, license, keywords
  - [ ] Optional hooks field (inline object or string path)
  - [ ] Optional skills, commands, agents, subAgents arrays
- [ ] 2.2 Create `schemas/hooks.schema.ts` with ArkType schema for hooks.json
  - [ ] Event type keys: SessionStart, PreToolUse, PostToolUse, etc.
  - [ ] Hook group structure with matcher (optional)
  - [ ] Hook objects: type (command/prompt), command/prompt fields, timeout
- [ ] 2.3 Create `schemas/marketplace.schema.ts` with ArkType schema for marketplace.json
  - [ ] Core fields: name, version, description, author
  - [ ] Plugins array with name, path, description
- [ ] 2.4 Create `schemas/skill-frontmatter.schema.ts` with ArkType schema for SKILL.md YAML
  - [ ] Required: name, version, description
  - [ ] Optional: category, tags, model, requires, triggers

## 3. Validation CLI

- [ ] 3.1 Create `scripts/validate-schemas.ts` main CLI
  - [ ] Parse command-line arguments (--changed, --help, --verbose)
  - [ ] Support file path filtering for git-changed files
  - [ ] Exit codes: 0 (success), 1 (validation errors)
- [ ] 3.2 Implement plugin.json validator
  - [ ] Discover all plugins/\*/. claude-plugin/plugin.json files
  - [ ] Validate each against plugin.schema.ts
  - [ ] If hooks field is string path, validate hooks.json file
  - [ ] If hooks field is inline object, validate inline structure
- [ ] 3.3 Implement marketplace.json validator
  - [ ] Validate .claude-plugin/marketplace.json
  - [ ] Check plugin references match actual plugin paths
- [ ] 3.4 Implement skill frontmatter validator
  - [ ] Discover all plugins/_/skills/_/SKILL.md files
  - [ ] Parse YAML frontmatter (between --- delimiters)
  - [ ] Validate against skill-frontmatter.schema.ts
- [ ] 3.5 Implement error message formatting
  - [ ] File path with line numbers (if available)
  - [ ] Show expected vs actual values
  - [ ] Suggest fixes where possible
  - [ ] Link to relevant Claude Code documentation
- [ ] 3.6 Add colored terminal output
  - [ ] Red for errors
  - [ ] Green for success
  - [ ] Yellow for warnings

## 4. Git Hook Integration

- [ ] 4.1 Update `.lefthook.yml` with pre-commit hook
  - [ ] Run: `bun run validate --changed`
  - [ ] Target: <500ms for typical commits
  - [ ] Fail text with helpful guidance
- [ ] 4.2 Update `.lefthook.yml` with pre-push hook
  - [ ] Run: `bun run validate --all`
  - [ ] Target: <2s for entire workspace
  - [ ] Comprehensive validation
- [ ] 4.3 Test git hooks with sample commits
  - [ ] Valid schema changes (should pass)
  - [ ] Invalid schema changes (should block)
  - [ ] Non-schema changes (should skip validation)

## 5. NPM Scripts

- [ ] 5.1 Add `validate` script to package.json: `bun run scripts/validate-schemas.ts`
- [ ] 5.2 Add `validate:plugins` script: `bun run scripts/validate-schemas.ts --plugins-only`
- [ ] 5.3 Add `validate:marketplace` script: `bun run scripts/validate-schemas.ts --marketplace-only`
- [ ] 5.4 Update README with validation commands

## 6. Fix Workflow Plugin (Immediate Blocker)

- [ ] 6.1 Run validator on workflow plugin to confirm error
- [ ] 6.2 Restructure hooks in `plugins/workflow/.claude-plugin/plugin.json`
  - [ ] Convert array format to nested object format
  - [ ] Or extract to external `hooks.json` file
- [ ] 6.3 Validate fix with new validator
- [ ] 6.4 Test workflow plugin loads correctly in Claude Code
- [ ] 6.5 Commit and push fix

## 7. Validate All Existing Plugins

- [ ] 7.1 Run validator on `plugins/meta/`
- [ ] 7.2 Run validator on `plugins/design-system/`
- [ ] 7.3 Run validator on `plugins/workflow/` (after fix)
- [ ] 7.4 Fix any discovered schema issues
- [ ] 7.5 Validate marketplace.json

## 8. Testing

- [ ] 8.1 Test validator with valid schemas (should pass)
- [ ] 8.2 Test validator with invalid schemas (should fail with clear errors)
- [ ] 8.3 Test `--changed` flag with git-staged files
- [ ] 8.4 Test performance targets
  - [ ] Pre-commit: <500ms for changed files
  - [ ] Pre-push: <2s for all schemas
- [ ] 8.5 Test error message clarity (can developers fix issues?)

## 9. Documentation

- [ ] 9.1 Update `docs/workflows/development.md` with validation commands
- [ ] 9.2 Add validation section to main README
- [ ] 9.3 Document how to bypass hooks if needed (`--no-verify`)
- [ ] 9.4 Add troubleshooting section for common schema errors

## 10. Finalization

- [ ] 10.1 Run full validation suite on entire workspace
- [ ] 10.2 Ensure all plugins pass validation
- [ ] 10.3 Mark ADR-0011 as Accepted (move from Proposed)
- [ ] 10.4 Archive OpenSpec proposal with `openspec archive add-schema-validation --skip-specs --yes`
