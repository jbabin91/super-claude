# Project Release Workflow

Instructions for versioning, changelog management, and archiving changes.

## Versioning

### When to Bump Versions

Bump plugin versions when plugin code changes (skills, agents, commands, hooks).

**Version Types:**

- **patch** - Bug fixes, corrections, non-breaking changes (0.0.X)
- **minor** - New features, new skills, backward-compatible additions (0.X.0)
- **major** - Breaking changes, API changes, major refactors (X.0.0)

### How to Bump Versions

**Option 1: Using Script (Recommended)**

```bash
./scripts/bump-version.sh <plugin-name> <patch|minor|major>

# Examples
./scripts/bump-version.sh meta patch
./scripts/bump-version.sh design-system minor
./scripts/bump-version.sh workflow major
```

**Option 2: Manual Update**

Update both files with the same version:

1. `plugins/{plugin}/.claude-plugin/plugin.json`
2. `.claude-plugin/marketplace.json`

Ensure versions match across both files!

### Version Bumping Rules

- **Always bump** when archiving OpenSpec changes that modify plugin code
- **Don't bump** for documentation-only changes
- **Don't bump** for changes outside plugin directories
- **Marketplace.json must match** plugin.json versions

## Changelog Management

### Structure

```markdown
# Changelog

## [Unreleased]

### Added

- **skill-name** - Brief description of what was added

### Changed

- **skill-name** - Brief description of what changed

### Fixed

- **skill-name** - Brief description of what was fixed

## [1.0.0] - 2025-01-15

### Added

- Initial release
```

### Categories

- **Added** - New skills, features, or capabilities
- **Changed** - Modifications to existing functionality
- **Fixed** - Bug fixes and corrections
- **Deprecated** - Features marked for removal
- **Removed** - Deleted features
- **Security** - Security fixes

### Entry Format

```markdown
- **skill-name** - Brief description of what was added/changed/fixed
```

**Good examples:**

```markdown
### Added

- **smart-commit-skill** - Conventional commits with gitmoji automation for git plugin
- **component-generator** - Base UI component scaffolding with Storybook integration

### Changed

- **skill-creator** - Updated to include official Claude Code field documentation
- **type-checker** - Convert from CLI to programmatic API for 10x performance

### Fixed

- **skill-validator** - Fix frontmatter parsing for YAML with nested objects
```

### When to Update Changelog

**Always add changelog entry when:**

- Archiving OpenSpec changes
- Adding new skills, agents, commands, or hooks
- Modifying existing plugin functionality
- Fixing bugs in plugin code

**Where to add:**

- Add under `[Unreleased]` section
- Create new version section when releasing

**Don't add changelog entries for:**

- Documentation updates (unless user-facing)
- Internal refactoring (unless behavior changes)
- Changes outside plugin directories

## Archiving OpenSpec Changes

### Standard Archiving Process

After OpenSpec change is deployed:

1. **Create separate PR** for archiving
2. **Move change directory:**
   - FROM: `openspec/changes/[change-id]/`
   - TO: `openspec/changes/archive/YYYY-MM-DD-[change-id]/`
3. **Update specs** (if capabilities changed)
4. **Bump versions** (if plugin code changed)
5. **Add CHANGELOG entry** (under `[Unreleased]`)
6. **Validate:** `openspec validate --strict`

### Using OpenSpec Archive Command

```bash
# Standard archive (with spec updates)
openspec archive <change-id>

# Skip spec updates (tooling-only changes)
openspec archive <change-id> --skip-specs

# Non-interactive mode (for automation)
openspec archive <change-id> --yes
openspec archive <change-id> --skip-specs --yes
```

**Always pass the change ID explicitly** (don't rely on interactive selection in automation).

### Archive Checklist

```markdown
- [ ] OpenSpec change fully deployed and tested
- [ ] Create new branch: `chore/archive-[change-id]`
- [ ] Move to archive with date prefix: `YYYY-MM-DD-[change-id]`
- [ ] Update specs/ if capabilities changed
- [ ] Bump plugin version if code changed
- [ ] Add CHANGELOG.md entry under [Unreleased]
- [ ] Run: `openspec validate --strict`
- [ ] Run: `bun run format && bun run lint:md`
- [ ] Create PR with "Archive [change-id]" title
- [ ] Merge after approval
```

### Example Archive PR

**Title:** `chore: archive add-skill-creator`

**Description:**

```markdown
## Summary

Archive completed OpenSpec change: `add-skill-creator`

## Changes

- Move `changes/add-skill-creator/` → `changes/archive/2025-01-15-add-skill-creator/`
- Update `specs/meta/spec.md` with new requirements
- Bump meta plugin version: 0.2.0 → 0.3.0
- Add CHANGELOG entry for skill-creator

## Validation

- [x] `openspec validate --strict` passes
- [x] Specs updated and validated
- [x] Version bumped in plugin.json + marketplace.json
- [x] CHANGELOG updated
```

## Version Release Process

### Creating a Release

When ready to release (typically after archiving multiple changes):

1. **Review `[Unreleased]` section** in CHANGELOG.md
2. **Determine version number** based on changes:
   - Breaking changes → major
   - New features → minor
   - Bug fixes only → patch
3. **Create version section:**

```markdown
## [1.2.0] - 2025-01-15

### Added

- **skill-creator** - Generate new skills with proper structure
- **component-generator** - Base UI component scaffolding

### Changed

- **skill-validator** - Improved error messages

[Move all Unreleased entries here]

## [Unreleased]

[Empty - ready for next cycle]
```

4. **Commit and tag:**

```bash
git add CHANGELOG.md
git commit -m "chore: release v1.2.0"
git tag v1.2.0
git push origin main --tags
```

5. **GitHub Release:**

```bash
gh release create v1.2.0 \
  --title "v1.2.0" \
  --notes "$(sed -n '/## \[1.2.0\]/,/## \[/p' CHANGELOG.md | sed '1d;$d')"
```

## Troubleshooting

### Version Mismatch

**Problem:** `plugin.json` and `marketplace.json` have different versions

**Solution:**

```bash
# Check versions
grep version plugins/meta/.claude-plugin/plugin.json
grep meta .claude-plugin/marketplace.json

# Fix manually or run bump script
./scripts/bump-version.sh meta patch
```

### Changelog Merge Conflicts

**Problem:** Multiple branches updating `[Unreleased]` section

**Solution:**

1. Accept both changes
2. Consolidate entries under appropriate categories
3. Remove duplicates
4. Maintain chronological order (newest first)

### Archive Date Format

**Always use:** `YYYY-MM-DD-[change-id]`

**Good:**

- `2025-01-15-add-skill-creator`
- `2025-12-01-refactor-hooks`

**Bad:**

- `01-15-2025-add-skill-creator` (wrong format)
- `add-skill-creator-2025-01-15` (date not prefix)
- `20250115-add-skill-creator` (missing dashes)

## Related Documentation

- **[OpenSpec Workflow](../../openspec/AGENTS.md)** - Creating and implementing proposals, complete workflow guide
- **[OpenSpec Quick Reference](openspec.md)** - Quick command reference and session persistence
- **[GitHub Flow](git/github-flow.md)** - Branching and PR workflow
- **[Commit Conventions](git/commit-conventions.md)** - Commit message format
