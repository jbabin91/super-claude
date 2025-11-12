# GitHub Workflow Instructions

Instructions for AI assistants working with GitHub workflows, pull requests, and commits.

## Pull Request Guidelines

### Keep PR Descriptions Concise

**Goal:** PR descriptions should be **scannable in ~30 seconds**.

**Template location:** `.github/PULL_REQUEST_TEMPLATE.md`

**Key principles:**

1. **Summary**: 1-3 sentences maximum
   - What changed and why
   - Not how it works (that's in the code review)

2. **Changes**: Bullet list of main changes
   - 5-10 items maximum
   - High-level features, not implementation details

3. **Test Plan**: Checklist format
   - What you tested, not how you tested it

_Optional:_ Add an **Additional Notes** section after the standard template sections for extra context:

- Performance notes
- Breaking changes
- Important caveats

**What NOT to include:**

- ❌ Implementation details (visible in code review)
- ❌ Documentation (belongs in README/code)
- ❌ Code examples (unless critical for understanding)
- ❌ Step-by-step explanations
- ❌ Multiple subsections with deep detail

**Good PR description:**

```markdown
## Summary

Convert type-checker hook from blocking to informative mode with programmatic API.

## Changes

- Replace CLI with programmatic API (~10x faster)
- Change from blocking to informative
- Add error categorization
- Add unified config support

## Test Plan

- [x] Manual testing
- [x] Config priority tested
- [x] Pre-commit hooks pass
```

**Bad PR description:**

```markdown
## Summary

Convert type-checker hook from CLI execution to programmatic API...

## Motivation

User feedback indicated... [5 paragraphs]

## Changes

### Core Functionality

**Programmatic API**: Replace execSync... [10 paragraphs with code examples]

### Configuration Priority System

New unified config system... [15 paragraphs with examples]

[...200+ more lines...]
```

### Finding the Template

**When creating PRs:**

1. **Always read** `.github/PULL_REQUEST_TEMPLATE.md` first
2. **Check** `.github/AGENTS.md` (this file) for PR guidelines
3. **Follow the template structure** - it's designed for quick scanning

**Search strategy:**

```bash
# Find PR template
find . -name "*PULL_REQUEST*" | grep -v node_modules

# Read template
cat .github/PULL_REQUEST_TEMPLATE.md
```

## Commit Conventions

**Format:** `<type>(<scope>): <gitmoji> <description>`

**Example:** `feat(workflow): :sparkles: add type-checker hook`

**See:** [docs/workflows/git/commit-conventions.md](../docs/workflows/git/commit-conventions.md) for complete conventions.

**Quick reference:**

- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring (no behavior change)
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `test`: Test additions/changes

## Branching Strategy

**See:** [docs/workflows/git/github-flow.md](../docs/workflows/git/github-flow.md) for complete workflow.

**Quick reference:**

- `main` - Protected branch (no direct commits)
- `feat/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring
- `docs/*` - Documentation updates

**Creating feature branches:**

```bash
git checkout -b feat/my-feature
```

## Pull Request Workflow

**Standard flow:**

1. Create feature branch
2. Make changes with conventional commits
3. Push branch: `git push -u origin feat/my-feature`
4. Create PR: `gh pr create` (follows template)
5. Address review feedback
6. Merge via GitHub (squash or merge commit)

**Important:**

- Read `.github/PULL_REQUEST_TEMPLATE.md` before creating PR
- Keep PR description concise (follow template guidance)
- Link related issues, ADRs, or OpenSpec proposals
- Check all checklist items before requesting review

## GitHub CLI Commands

**Common commands:**

```bash
# View PR
gh pr view

# View PR comments
gh pr view --comments

# Add comment
gh pr comment <number> --body "message"

# Edit PR description
gh pr edit <number> --body "$(cat <<'EOF'
...
EOF
)"

# Create PR with template
gh pr create  # Opens editor with template
```

## Troubleshooting

### PR Description Too Long

**Problem:** Created PR with 200+ lines of detailed documentation

**Solution:**

1. Read `.github/PULL_REQUEST_TEMPLATE.md`
2. Read this file (`.github/AGENTS.md`)
3. Rewrite following template structure (aim for ~50 lines max)

**Remember:** Details belong in:

- **Code review** - Implementation details
- **README** - Documentation and examples
- **ADRs** - Architecture decisions
- **OpenSpec** - Proposals and specifications

### Can't Find PR Template

**Location:** `.github/PULL_REQUEST_TEMPLATE.md`

**If missing:**

1. Check this file exists
2. Verify not in `.git/` or `node_modules/`
3. Create from scratch if needed

## Related Documentation

- [Commit Conventions](../docs/workflows/git/commit-conventions.md) - Full commit format guide
- [GitHub Flow](../docs/workflows/git/github-flow.md) - Complete branching workflow
- [Development Commands](../docs/workflows/development.md) - Setup and common tasks
