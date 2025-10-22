# Add Smart Commit Skill

## Why

Git commits in TypeScript projects should follow conventional commit format with gitmoji for better changelog generation and commit history readability. Currently, developers must manually format commits, remember gitmoji codes, and ensure conventional commit compliance, leading to inconsistent commit messages and wasted time.

This skill will enable Claude to automatically generate properly formatted commit messages following conventional commits + gitmoji conventions, improving commit quality and reducing cognitive load.

## What Changes

- **ADD** new git commit workflow capability to git-tools plugin
- **ADD** skill file: `plugins/git-tools/skills/smart-commit/SKILL.md`
- **ADD** conventional commit format automation
- **ADD** gitmoji integration and auto-selection
- **ADD** commit message validation
- **ADD** support for scope detection and body generation
- **ADD** examples and documentation

## Impact

- **Affected specs:** New capability `git-commit-workflow` in git-tools
- **Affected code:**
  - `plugins/git-tools/skills/smart-commit/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update to reference new skill)
- **Dependencies:**
  - Requires Git installed
  - No external dependencies (uses standard git commands)
- **Users:** All developers committing code in TypeScript/JavaScript projects
- **Benefits:**
  - Consistent commit message format across projects
  - Automatic gitmoji selection based on change type
  - Reduced time spent crafting commit messages
  - Better changelog generation support
  - Improved commit history readability
