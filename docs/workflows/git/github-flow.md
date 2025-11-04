# GitHub Flow

Git workflow and branching strategy for the super-claude project, following [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow).

## Overview

GitHub Flow is a lightweight, branch-based workflow:

1. Create a branch from `main`
2. Make changes and commit
3. Open a Pull Request
4. Review and discuss
5. Merge to `main`
6. Delete branch

## Branching Strategy

### Main Branch

- **Name:** `main`
- **Purpose:** Production-ready code
- **Protection:** Requires PR approval
- **Merging:** Squash and merge only

### Feature Branches

**Format:** `[type]/[description]`

**Examples:**

```txt
feat/add-smart-commit-skill
fix/component-generator-props
docs/update-skill-guides
chore/update-dependencies
```

**Branch Types:**

- `feat/` - New features or skills
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks
- `refactor/` - Code restructuring
- `test/` - Test additions/changes

### Branch Lifecycle

1. **Create branch** from `main`:

   ```bash
   git checkout main
   git pull
   git checkout -b feat/your-feature
   ```

2. **Work on branch** with regular commits (see [commit conventions](commit-conventions.md))

3. **Keep up-to-date** with main:

   ```bash
   git checkout main
   git pull
   git checkout feat/your-feature
   git rebase main
   ```

4. **Create PR** when ready

5. **Squash and merge** to main after approval

6. **Delete branch** after merge

## Pull Request Workflow

### Creating PRs

1. **Push branch** to remote:

   ```bash
   git push -u origin feat/your-feature
   ```

2. **Create PR** via GitHub or `gh` command:

   ```bash
   gh pr create --title "feat(components): add component-generator skill"
   ```

   GitHub automatically loads the PR template from `.github/PULL_REQUEST_TEMPLATE.md`

3. **Fill out the template** with:
   - Summary of changes
   - Related issues/ADRs/OpenSpec proposals
   - Test plan and verification steps
   - Screenshots (if UI changes)
   - Checklist confirmation

### PR Requirements

The PR template includes a checklist with all requirements:

- ✅ All commits follow [commit conventions](commit-conventions.md)
- ✅ Code passes linting (`bun run lint` and `bun run lint:md`)
- ✅ Code is formatted (`bun run format`)
- ✅ Tests pass (if applicable)
- ✅ Documentation updated
- ✅ Related ADRs/proposals referenced

**Tip:** Complete the checklist before requesting review.

### Review Process

1. **Self-review** your changes first
2. **Request review** from maintainers
3. **Address feedback** in new commits
4. **Squash and merge** once approved

### Merge Strategy

**Always use "Squash and Merge":**

- Keeps main branch history clean
- Single commit per PR
- Commit message uses PR title + description

## Common Workflows

### Creating a New Skill

```bash
# 1. Create feature branch
git checkout -b feat/add-component-generator

# 2. Use skill-creator to scaffold (work in Claude Code)

# 3. Test skill thoroughly

# 4. Commit with conventional format
git add plugins/components/skills/component-generator/
git commit -m "feat(components): :sparkles: add component-generator skill"

# 5. Push and create PR
git push -u origin feat/add-component-generator
gh pr create --title "feat(components): add component-generator skill"
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/skill-activation-typo

# 2. Make fix

# 3. Commit
git commit -m "fix(meta): :bug: correct typo in skill-activation-prompt"

# 4. Push and create PR
git push -u origin fix/skill-activation-typo
```

### Updating Documentation

```bash
# 1. Create docs branch
git checkout -b docs/update-adr-guide

# 2. Update docs

# 3. Commit
git commit -m "docs(architecture): :memo: clarify ADR workflow"

# 4. Push and create PR
git push -u origin docs/update-adr-guide
```

## Advanced Workflows

### Rebasing onto Main

Keep your branch up-to-date with main:

```bash
git checkout main
git pull
git checkout feat/your-feature
git rebase main

# If conflicts, resolve them, then:
git rebase --continue

# Force push (only on your feature branch!)
git push --force-with-lease
```

### Stashing Changes

Temporarily save uncommitted work:

```bash
# Stash changes
git stash save "WIP: working on component generator"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Cherry-Picking Commits

Apply specific commits to another branch:

```bash
git checkout main
git cherry-pick <commit-hash>
```

## Git Hooks

The project uses hooks for quality checks:

### Pre-commit

- Runs linting on staged files
- Runs formatting checks
- Validates commit message format

**Setup:**

```bash
# Hooks are configured via lefthook
# Install dependencies to enable hooks
bun install
```

### Pre-push

- Runs tests (if applicable)
- Validates branch naming

## Best Practices

### Commits

- ✅ **Small, focused commits** - One logical change per commit
- ✅ **Descriptive messages** - Follow [commit conventions](commit-conventions.md)
- ✅ **Test before committing** - Ensure code works
- ✅ **Stage selectively** - Only stage files for one logical change
- 💡 **Use AI commit generation** - Configured to follow our conventions (see [Development Commands](../development.md#using-vs-code-commit-generation))
- ❌ **Don't commit secrets** - Use .gitignore for sensitive files
- ❌ **Don't commit directly to main** - Always use feature branches
- ❌ **Don't stage everything** - Avoid `git add .` with unrelated changes

### Branches

- ✅ **Delete after merge** - Keep repository clean
- ✅ **Rebase regularly** - Stay up-to-date with main
- ✅ **Use descriptive names** - Clear purpose from branch name
- ❌ **Don't long-lived branches** - Merge frequently
- ❌ **Don't work directly on main** - Always use feature branches

### Pull Requests

- ✅ **Keep PRs focused** - One feature/fix per PR
- ✅ **Update documentation** - Include in same PR
- ✅ **Reference issues/ADRs** - Provide context
- ✅ **Respond to feedback** - Address review comments
- ❌ **Don't force-push after review** - Add new commits instead

## Troubleshooting

### "Cannot merge due to conflicts"

```bash
# Update your branch
git checkout main
git pull
git checkout your-branch
git rebase main

# Resolve conflicts in editor
# Then continue rebase
git add .
git rebase --continue
```

### "Accidentally committed to main"

```bash
# Move commit to new branch
git branch fix/my-accidental-commit
git reset --hard HEAD~1
git checkout fix/my-accidental-commit
```

### "Want to undo last commit"

```bash
# Keep changes, remove commit
git reset --soft HEAD~1

# Discard changes and commit
git reset --hard HEAD~1
```

## Related Documentation

- [Commit Conventions](commit-conventions.md) - Commit message format
- [OpenSpec Workflow](../openspec.md) - Spec-driven development process
- [Development Commands](../development.md) - Common development tasks
- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) - Official GitHub documentation
