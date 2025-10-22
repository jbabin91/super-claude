# Add PR Description Skill

## Why

Pull request descriptions should summarize changes, link to issues, and follow project templates. Manual PR description writing is repetitive and often incomplete, reducing code review effectiveness.

This skill will enable Claude to auto-generate PR descriptions from commit history and changes, following PR templates and best practices.

## What Changes

- **ADD** new pull-request-workflow capability to git-tools plugin
- **ADD** skill file: `plugins/git-tools/skills/pr-description/SKILL.md`
- **ADD** commit history analysis
- **ADD** PR template integration
- **ADD** automatic summary generation
- **ADD** issue/PR linking

## Impact

- **Affected specs:** New capability `pull-request-workflow` in git-tools
- **Affected code:**
  - `plugins/git-tools/skills/pr-description/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update)
- **Dependencies:**
  - Requires Git
  - Optional: gh CLI for GitHub integration
- **Benefits:**
  - Consistent PR descriptions
  - Better code review context
  - Automated from commit messages
  - Template compliance
