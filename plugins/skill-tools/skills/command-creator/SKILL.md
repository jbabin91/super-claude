---
name: command-creator
version: 1.0.0
description: |
  Create custom slash commands for Claude Code.
  Generate commands with proper markdown structure and YAML frontmatter.
  Use when you need project-specific or workflow-specific commands.
category: meta
tags: [commands, slash-commands, meta, automation]
model: sonnet
triggers:
  keywords: [create command, generate command, new command, slash command]
  patterns: ["create.*(command|slash)", "generate.*command"]
---

# Command Creator

Generate custom slash commands for Claude Code with proper structure.

## When to Use

- Creating project-specific commands
- Automating repetitive workflows
- Building team-shared commands
- Standardizing common operations

## Command Structure

Commands are markdown files in the `commands/` directory with YAML frontmatter:

```markdown
---
description: Brief description of what this command does
---

# Command instructions

Detailed instructions for Claude to follow when this command is executed.

## Context

Information about when and how to use this command.

## Examples

Example usage and expected outcomes.
```

## Core Workflow

### 1. Gather Requirements

Ask the user:

- **Command name**: `/command-name` (what should user type?)
- **Purpose**: What does this command do?
- **Parameters**: Does it need arguments?
- **Context**: When should it be used?
- **Location**: Project-local or global?

### 2. Generate Command File

**Location:**

- Global: `~/.claude/skills/super-claude/plugins/[plugin]/commands/command-name.md`
- Project: `/path/to/project/.claude/commands/command-name.md`

**Format:**

```markdown
---
description: One-line description (required)
---

# Command Name

## Purpose
Clear explanation of what this command does.

## Usage
\`\`\`
/command-name [arguments]
\`\`\`

## Instructions for Claude

Step-by-step instructions for Claude to follow:

1. First action
2. Second action
3. Third action

## Parameters

- `arg1`: Description of first argument
- `arg2`: Description of second argument (optional)

## Examples

### Example 1: Common Use Case
\`\`\`
/command-name value1 value2
\`\`\`
Expected outcome: [description]

### Example 2: With Options
\`\`\`
/command-name --option value
\`\`\`
Expected outcome: [description]

## Notes

- Important consideration 1
- Important consideration 2
```

### 3. Validate Command

Ensure:

- ✅ Description is clear and concise
- ✅ Instructions are actionable
- ✅ Examples are realistic
- ✅ Parameter descriptions are complete
- ✅ File is in correct location

## Example Commands

### Project Setup Command

```markdown
---
description: Initialize a new TanStack Start project with drizzle and better-auth
---

# Setup TanStack Fullstack

## Purpose
Quickly scaffold a new TanStack Start project with database and authentication.

## Usage
\`\`\`
/setup-tanstack-fullstack [project-name]
\`\`\`

## Instructions for Claude

1. Create new directory with project-name
2. Initialize TanStack Start project
3. Install and configure Drizzle ORM with Postgres
4. Set up better-auth with Drizzle adapter
5. Create initial database schema
6. Set up environment variables
7. Create README with setup instructions

## Parameters

- `project-name`: Name of the new project directory

## Examples

### Example: Create New Project
\`\`\`
/setup-tanstack-fullstack my-app
\`\`\`

Creates:
- my-app/ directory
- TanStack Start configuration
- Drizzle + Postgres setup
- better-auth integration
- Initial schema and migrations
```

### Code Review Command

```markdown
---
description: Perform comprehensive code review with focus areas
---

# Review Code

## Purpose
Systematic code review checking for common issues and best practices.

## Usage
\`\`\`
/review-code [--focus=area]
\`\`\`

## Instructions for Claude

1. Analyze current file or git diff
2. Check for:
   - Type safety issues
   - Accessibility concerns
   - Performance problems
   - Security vulnerabilities
   - Best practice violations
3. If --focus provided, emphasize that area
4. Provide specific, actionable feedback
5. Suggest improvements with code examples

## Parameters

- `--focus`: Optional focus area (security, performance, accessibility, types)

## Examples

### Example: General Review
\`\`\`
/review-code
\`\`\`

### Example: Security Focus
\`\`\`
/review-code --focus=security
\`\`\`
```

### Deployment Command

```markdown
---
description: Deploy to Cloudflare Pages with pre-deployment checks
---

# Deploy Cloudflare

## Purpose
Deploy current project to Cloudflare Pages with safety checks.

## Usage
\`\`\`
/deploy-cloudflare [--environment=prod|staging]
\`\`\`

## Instructions for Claude

1. Run pre-deployment checks:
   - All tests passing
   - No TypeScript errors
   - No ESLint errors
   - Build succeeds
2. Confirm environment variables are set
3. Build production bundle
4. Deploy to Cloudflare Pages
5. Verify deployment successful
6. Provide deployment URL

## Parameters

- `--environment`: Target environment (default: staging)

## Examples

### Example: Deploy to Staging
\`\`\`
/deploy-cloudflare
\`\`\`

### Example: Deploy to Production
\`\`\`
/deploy-cloudflare --environment=prod
\`\`\`
```

## Command Categories

### Project Setup

- `/setup-*`: Initialize new projects
- `/scaffold-*`: Create project structure

### Code Generation

- `/generate-*`: Create code/files
- `/create-*`: Create components/modules

### Code Quality

- `/review-*`: Code review commands
- `/fix-*`: Auto-fix issues
- `/lint-*`: Linting operations

### Testing

- `/test-*`: Run tests
- `/coverage-*`: Coverage analysis

### Deployment

- `/deploy-*`: Deployment operations
- `/release-*`: Release management

### Documentation

- `/docs-*`: Generate documentation
- `/explain-*`: Explain code/concepts

## Best Practices

1. **Clear Names**: Use descriptive command names
2. **Single Purpose**: One command = one clear action
3. **Good Defaults**: Sensible default parameters
4. **Safe Operations**: Confirm destructive actions
5. **Helpful Output**: Provide clear feedback

## Anti-Patterns

- ❌ Generic names (helper, util, do-thing)
- ❌ Multiple unrelated actions in one command
- ❌ Missing parameter descriptions
- ❌ No examples
- ❌ Destructive operations without confirmation

## Troubleshooting

### Command Not Found

**Solution**: Ensure file is in `commands/` directory and Claude Code has been restarted

### Command Parameters Not Working

**Solution**: Check parameter format in examples, ensure clear documentation

## References

- [Claude Code Commands Documentation](https://docs.claude.com/en/docs/claude-code/commands)
- [super-claude Command Examples](../../commands/)
