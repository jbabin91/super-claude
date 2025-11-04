# Development Commands

This document describes common development commands and setup for the super-claude project.

## Prerequisites

### Required Tools

- **Bun**: Latest (package manager and runtime)
- **Git**: v2.40+ (version control)
- **Node.js**: v20+ (optional, for compatibility with some tools)

### Optional Tools

- **Claude Code**: For testing skills locally
- **VS Code**: Recommended editor with markdownlint extension

## Initial Setup

### 1. Clone Repository

```sh
git clone https://github.com/jbabin91/super-claude.git
cd super-claude
```

### 2. Install Dependencies

```sh
bun install
```

This will:

- Install all dependencies
- Set up git hooks (via lefthook)
- Prepare the development environment

### 3. Verify Installation

```sh
# Check Bun
bun --version  # Should be latest

# Check Git
git --version  # Should be v2.40+

# Optional: Check Node.js (if installed)
node --version  # Should be v20+ if installed
```

## Plugin Installation

### Adding the Marketplace

```sh
# In Claude Code, add the marketplace
/plugin marketplace add jbabin91/super-claude
```

### Installing Plugins

```sh
# Core plugin (for plugin creators)
/plugin install meta

# Domain plugins (install based on your needs)
/plugin install design-system    # Base UI, shadcn/ui, design tokens, WCAG AAA
/plugin install testing          # Vitest, Playwright, E2E testing
/plugin install typescript       # Type checking, refactoring, imports
/plugin install git              # Smart commits, PR descriptions, worktrees
/plugin install devops           # GitHub Actions, Docker, CI/CD
```

### Verifying Plugin Installation

```sh
# List installed plugins
/plugin list

# Check plugin details
/plugin info meta
```

## Code Quality

### Formatting

```sh
# Format all files with Prettier
bun run format

# Check formatting without changing files
bun run format:check
```

**What it formats:**

- All markdown files (`.md`)
- TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`)
- JSON files (`.json`)
- YAML files (`.yaml`, `.yml`)

### Linting

```sh
# Lint markdown files
bun run lint:md

# Auto-fix fixable markdown issues
bun run lint:md:fix

# Lint TypeScript/JavaScript files
bun run lint

# Auto-fix TypeScript/JavaScript issues
bun run lint:fix
```

**What it checks:**

**Markdown (lint:md):**

- Code blocks have language identifiers (MD040)
- Blank lines before lists (MD032)
- Blank lines around headings (MD022/MD023)

**TypeScript/JavaScript (lint):**

- ESLint rules
- Import sorting
- Code quality issues

### Pre-commit Checks

**ALWAYS run before committing:**

```sh
# Format all files
bun run format

# Lint markdown
bun run lint:md

# Lint TypeScript/JavaScript
bun run lint

# Auto-fix if needed
bun run lint:md:fix  # Markdown fixes
bun run lint:fix     # TS/JS fixes
```

## Creating Skills

### Using skill-creator

The meta plugin provides skill-creator for generating new skills:

```sh
# 1. Install meta plugin (if not already installed)
/plugin install meta

# 2. In Claude Code, trigger skill-creator through conversation
# Example: "Create a new skill for generating Hono API routes"

# 3. skill-creator will auto-activate and guide you through:
#    - Skill name and description
#    - Category and tags
#    - Model selection (sonnet, haiku, opus)
#    - Required tools and dependencies
#    - Activation triggers (keywords, patterns)
```

### Manual Skill Creation

If creating skills manually:

```sh
# 1. Create skill directory
mkdir -p plugins/{plugin-name}/skills/{skill-name}

# 2. Create SKILL.md with YAML frontmatter
touch plugins/{plugin-name}/skills/{skill-name}/SKILL.md

# 3. Optionally create API_REFERENCE.md for advanced topics
touch plugins/{plugin-name}/skills/{skill-name}/API_REFERENCE.md

# 4. Add skill to skill-rules.json
# Edit: plugins/{plugin-name}/skills/skill-rules.json
```

**Required structure:**

```sh
plugins/{plugin-name}/skills/{skill-name}/
├── SKILL.md              # Core instructions (< 500 lines)
├── API_REFERENCE.md      # Advanced topics (optional)
└── supporting/           # Additional resources (optional)
```

## Testing

### Testing Skills Locally

```sh
# 1. Create skill using skill-creator
# 2. Open Claude Code in relevant project
# 3. Trigger skill through conversation
# 4. Verify behavior matches expectations
# 5. Iterate based on failures
```

### RED-GREEN-REFACTOR Methodology

**RED Phase:**

```sh
# 1. Run scenarios WITHOUT the skill
# 2. Document failures and rationalizations
# 3. Identify specific problems to solve
```

**GREEN Phase:**

```sh
# 1. Write minimal skill addressing failures
# 2. Use skill-creator from meta plugin
# 3. Test that Claude complies with skill
```

**REFACTOR Phase:**

```sh
# 1. Identify new rationalizations
# 2. Add explicit counters and guards
# 3. Re-test until bulletproof
```

### Automated Testing

```sh
# Run Vitest tests (if available)
bun test

# Run tests with coverage
bun test --coverage

# Run tests in watch mode
bun test --watch
```

## OpenSpec Workflow

### Creating Proposals

```sh
# 1. Navigate to openspec directory
cd openspec/changes

# 2. Create new change directory
mkdir {change-id}
cd {change-id}

# 3. Create proposal files
touch proposal.md
touch design.md
touch tasks.md
mkdir specs/
mkdir supporting/

# Or use the /openspec:proposal command in Claude Code
/openspec:proposal
```

### Working on Proposals

```sh
# Start working on a change
/openspec:work {change-id}

# Check status
/openspec:status

# Save progress
/openspec:checkpoint

# Complete work
/openspec:done

# Archive completed proposal
/openspec:archive {change-id}
```

## Git Workflow

### Creating Feature Branches

```sh
# 1. Ensure main is up-to-date
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/your-feature
```

### Committing Changes

```sh
# 1. Format and lint
bun run format
bun run lint:md
bun run lint

# 2. Stage ONLY the files for this logical change
git add path/to/changed/files

# 3. Commit with conventional format
git commit -m "feat(plugin): :sparkles: add new feature"
```

**Important:** Only stage files related to ONE logical change. If you have multiple unrelated changes, make separate commits.

#### Using VS Code Commit Generation

If using VS Code or VS Code Insiders with AI assistants (GitHub Copilot, Claude Code, etc.):

1. **Stage files** for one logical change (Source Control view)
2. **Click sparkle icon** (✨) in commit message box
3. **Review generated message** - it should follow our conventions automatically
4. **Edit if needed** - the AI suggestion is a starting point
5. **Commit** staged files

**How it works:**

The project uses **nested AGENTS.md files** for commit instructions:

- **`.github/AGENTS.md`** - Contains all commit conventions and git workflow rules
- **`AGENTS.md`** (root) - Contains OpenSpec workflow instructions
- Nested AGENTS.md enabled via user settings: `"chat.useNestedAgentsMdFiles": true`
- AI assistants load relevant AGENTS.md files based on context

**Why AGENTS.md?**

✅ **Agent-agnostic** - Works with any AI tool (Copilot, Claude Code, etc.)
✅ **Context-aware** - Automatically applies when working on git/GitHub files
✅ **Version controlled** - Instructions tracked in git
✅ **Team shareable** - Everyone gets same conventions
✅ **Centralized** - Single source of truth per workflow
✅ **Maintainable** - Easy to update and review

**Tips:**

- ✅ Stage related files together (e.g., all files for a single feature)
- ✅ Use multiple commits for multiple changes
- ✅ Reload VS Code after pulling updates to get latest instructions
- ❌ Don't stage everything with `git add .` before generating commit
- ❌ Don't commit unrelated changes together

**Troubleshooting:**

If generated commits don't follow conventions:

1. Reload VS Code window (Cmd/Ctrl + Shift + P → "Reload Window")
2. Check `.github/AGENTS.md` exists
3. Verify nested AGENTS.md is enabled: `"chat.useNestedAgentsMdFiles": true` in user settings
4. Ensure only relevant files are staged

### Pushing and Creating PRs

```sh
# 1. Push branch
git push -u origin feat/your-feature

# 2. Create PR via GitHub CLI
gh pr create --title "feat(plugin): add new feature"

# Or create PR manually on GitHub
```

See [Git Workflow](git.md) for detailed branching strategy.

## Common Tasks

### Adding a New Plugin

```sh
# 1. Create plugin directory
mkdir -p plugins/{plugin-name}

# 2. Create plugin structure
mkdir -p plugins/{plugin-name}/{skills,commands,agents,hooks}

# 3. Create marketplace manifest
touch plugins/{plugin-name}/.claude-plugin/manifest.json

# 4. Create README
touch plugins/{plugin-name}/README.md
```

### Adding a New Skill

```sh
# 1. Use skill-creator (recommended)
/plugin install meta
# Then in conversation: "Create a skill for..."

# 2. Or create manually
mkdir -p plugins/{plugin-name}/skills/{skill-name}
touch plugins/{plugin-name}/skills/{skill-name}/SKILL.md
```

### Updating Dependencies

```sh
# Update all dependencies
bun update

# Update specific package
bun update {package-name}

# Check for outdated packages
bun outdated
```

### Building for Distribution

```sh
# 1. Ensure all tests pass
bun test

# 2. Format and lint
bun run format
bun run lint:md
bun run lint

# 3. Build plugins (if build step exists)
bun run build

# 4. Verify marketplace manifest
cat .claude-plugin/marketplace.json
```

## Environment Configuration

### Project-Level Overrides

Create `.claude/skills/skill-rules.json` for project customization:

```sh
# Generate template
/configure-activation

# Or create manually
mkdir -p .claude/skills
touch .claude/skills/skill-rules.json
```

**Example override:**

```json
{
  "version": "1.0",
  "overrides": {
    "meta/skill-creator": {
      "priority": "critical",
      "promptTriggers": {
        "keywords": ["create skill", "scaffold skill"]
      }
    }
  },
  "disabled": ["meta/old-skill"],
  "global": {
    "maxSkillsPerPrompt": 3,
    "priorityThreshold": "high"
  }
}
```

### Git Configuration

```sh
# Set user name and email
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Enable GPG signing (optional)
git config commit.gpgsign true

# Set default branch
git config init.defaultBranch main
```

## Troubleshooting

### Bun Issues

```sh
# Clear bun cache
bun pm cache rm

# Remove node_modules and reinstall
rm -rf node_modules
bun install
```

### Skill Activation Issues

```sh
# Check Bun installation
bun --version

# Verify hook exists
ls -la .claude/hooks/skill-activation-prompt.ts

# Make hook executable
chmod +x .claude/hooks/skill-activation-prompt.ts

# Check plugin rules
cat plugins/meta/skills/skill-rules.json
```

### Formatting Issues

```sh
# Check Prettier config
cat .prettierrc.json

# Check for Prettier ignore
cat .prettierignore

# Run format with verbose output
bun run format --loglevel debug
```

### Linting Issues

```sh
# Check markdownlint config
cat .markdownlint-cli2.mjs

# Lint specific file with auto-fix
bunx markdownlint-cli2 --fix "path/to/file.md"
```

## Best Practices

### DO ✅

- **Run format and lint before committing**
- **Test skills thoroughly in Claude Code**
- **Follow conventional commits with gitmoji**
- **Keep SKILL.md files under 500 lines**
- **Use skill-creator for new skills**
- **Create feature branches for all changes**
- **Update documentation with code changes**
- **Reference ADRs in OpenSpec proposals**

### DON'T ❌

- **Commit without formatting**
- **Skip linting markdown**
- **Deploy untested skills**
- **Commit directly to main**
- **Use vague commit messages**
- **Create skills without YAML frontmatter**
- **Skip code review**
- **Forget to update CHANGELOG**

## Quick Reference

```txt
┌─────────────────────────────────────────────────────┐
│ Essential Commands                                  │
├─────────────────────────────────────────────────────┤
│ Setup                                               │
│   bun install               - Install dependencies  │
│   /plugin install meta      - Install meta plugin   │
│                                                     │
│ Code Quality                                        │
│   bun run format            - Format all files      │
│   bun run lint:md           - Lint markdown         │
│   bun run lint              - Lint TypeScript/JS    │
│   bun run lint:md:fix       - Auto-fix markdown     │
│   bun run lint:fix          - Auto-fix TS/JS        │
│                                                     │
│ Git Workflow                                        │
│   git checkout -b feat/...  - Create feature branch │
│   git commit -m "..."       - Commit with message   │
│   gh pr create              - Create pull request   │
│                                                     │
│ OpenSpec                                            │
│   /openspec:proposal        - Create new proposal   │
│   /openspec:work            - Start working         │
│   /openspec:done            - Complete work         │
│                                                     │
│ Testing                                             │
│   Manual testing in Claude Code                     │
│   RED-GREEN-REFACTOR methodology                    │
└─────────────────────────────────────────────────────┘
```

## Related Documentation

- [Git Workflow](git.md) - Branching strategy and pull requests
- [Commit Conventions](commits.md) - Commit message formatting
- [OpenSpec Workflow](openspec.md) - Spec-driven development
- [Markdown Standards](../standards/markdown.md) - Markdown formatting rules
- [Skill Activation Guide](../guides/skill-activation.md) - Auto-activation system
- [Architecture Decisions](../architecture/README.md) - ADR usage guide

## Need Help?

- **For plugin creators**: See [meta plugin](../../plugins/meta/README.md)
- **For contributors**: See [Git Workflow](git.md) and [Commit Conventions](commits.md)
- **For architecture questions**: See [Architecture INDEX](../architecture/INDEX.md)
- **For OpenSpec questions**: See [OpenSpec Workflow](openspec.md)
