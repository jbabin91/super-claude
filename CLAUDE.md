# CLAUDE.md

This file provides Claude Code-specific configuration for the super-claude repository.

For complete project instructions, see @AGENTS.md.

## Workflow-Specific Instructions

### OpenSpec Workflow

<!-- OPENSPEC:START -->

Always open @openspec/AGENTS.md when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use @openspec/AGENTS.md to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

### Git & GitHub Workflow

**IMPORTANT: Before creating pull requests, always read @.github/AGENTS.md for complete guidelines.**

Key topics covered:

- Pull request descriptions (keep concise!)
- Commit message format (conventional commits + gitmoji)
- Branching strategy (GitHub Flow)
- PR template usage

## Claude Code-Specific Notes

- All project instructions in @AGENTS.md are agent-agnostic and work with any AI tool
- Nested AGENTS.md files provide context-aware instructions for different workflows
- Use `/plugin install meta` for plugin creation tools
- Use `/configure-activation` to customize skill auto-activation for this project

## File Organization Pattern

**IMPORTANT for AI assistants editing these files:**

- **CLAUDE.md** (this file) - References other files using `@` import syntax, minimal content
- **AGENTS.md** - Main agent instructions, detailed content lives here
- **`.github/AGENTS.md`** - GitHub workflow details (git, PRs, commits)
- **`openspec/AGENTS.md`** - OpenSpec workflow details

**Rule: Use `@filename` syntax to import, don't duplicate content between files.**

Good:

```markdown
See @.github/AGENTS.md for PR guidelines.
```

Bad:

```markdown
PR guidelines:

- Keep concise
- [repeating content from .github/AGENTS.md]
```
