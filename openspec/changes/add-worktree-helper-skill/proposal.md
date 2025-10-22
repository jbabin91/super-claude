# Add Worktree Helper Skill

## Why

Git worktrees enable parallel development on multiple branches, but setup and management is complex. Developers waste time with manual worktree commands and directory management.

This skill will enable Claude to automate git worktree creation, switching, and cleanup for parallel development workflows.

## What Changes

- **ADD** new git-worktree capability to git-tools plugin
- **ADD** skill file: `plugins/git-tools/skills/worktree-helper/SKILL.md`
- **ADD** worktree creation automation
- **ADD** worktree list and status
- **ADD** worktree cleanup and removal
- **ADD** parallel development workflow guidance

## Impact

- **Affected specs:** New capability `git-worktree` in git-tools
- **Affected code:**
  - `plugins/git-tools/skills/worktree-helper/SKILL.md` (new)
  - `.claude-plugin/marketplace.json` (update)
- **Dependencies:**
  - Requires Git 2.5+ (worktree support)
- **Benefits:**
  - Simplified parallel development
  - Automated worktree management
  - Reduced context switching
  - Better workflow organization
