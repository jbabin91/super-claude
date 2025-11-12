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

**IMPORTANT: Before creating any pull requests, always read @.github/AGENTS.md**

This file contains critical guidelines for:

- **Pull request descriptions** - Keep concise (~50 lines, scannable in 30 seconds)
- **Commit message format** - Conventional commits + gitmoji
- **Branching strategy** - GitHub Flow with protected main branch
- **PR template usage** - What to include and what to avoid
- **Where details belong** - Code review vs README vs ADRs vs OpenSpec

**Quick PR checklist:**

- Read `.github/PULL_REQUEST_TEMPLATE.md` before creating PR
- Summary: 1-3 sentences maximum
- Changes: Bullet list (5-10 items max)
- Avoid: Implementation details, documentation, code examples in PR description

## Claude Code-Specific Notes

- All project instructions in @AGENTS.md are agent-agnostic and work with any AI tool
- Nested AGENTS.md files provide context-aware instructions for different workflows
- Use `/plugin install meta` for plugin creation tools
- Use `/configure-activation` to customize skill auto-activation for this project
