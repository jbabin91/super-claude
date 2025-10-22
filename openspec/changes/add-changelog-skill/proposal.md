# Add Changelog Skill

## Why

Maintaining CHANGELOG.md files from conventional commits is manual and error-prone. Automated changelog generation ensures consistent documentation of changes.

This skill will enable Claude to generate changelog entries from conventional commit messages, following Keep a Changelog format.

## What Changes

- **ADD** new changelog-generation capability to git-tools plugin
- **ADD** skill file: `plugins/git-tools/skills/changelog/SKILL.md`
- **ADD** conventional commit parsing
- **ADD** Keep a Changelog format generation
- **ADD** version section organization
- **ADD** breaking change highlighting

## Impact

- **Affected specs:** New capability `changelog-generation` in git-tools
- **Affected code:**
  - `plugins/git-tools/skills/changelog/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update)
- **Dependencies:**
  - Requires Git
  - Conventional commit messages
- **Benefits:**
  - Automated changelog updates
  - Consistent format
  - Breaking change visibility
  - Release documentation
