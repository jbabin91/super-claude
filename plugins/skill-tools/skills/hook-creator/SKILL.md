---
name: hook-creator
version: 1.0.0
description: |
  Create event hooks for Claude Code that trigger on specific events.
  Generate hooks with proper JSON configuration following Anthropic specifications.
  Use for automating workflows based on events like file saves, tool calls, or user prompts.
category: meta
tags: [hooks, events, automation, meta]
model: sonnet
triggers:
  keywords: [create hook, generate hook, new hook, event hook]
  patterns: ["create.*hook", "generate.*hook"]
---

# Hook Creator

Generate event-driven hooks for Claude Code with proper configuration.

## When to Use

- Automating actions on specific events
- Running checks before/after tool calls
- Formatting code on save
- Validating inputs before processing
- Triggering notifications or logging

## Hook System Overview

Hooks allow you to run shell commands or scripts in response to Claude Code events:

**Event Types:**

- `user-prompt-submit` - Before Claude processes user input
- `tool-call` - Before/after tool execution
- `session-start` - When Claude Code session begins
- `session-end` - When session ends

## Core Workflow

### 1. Gather Requirements

Ask the user:

- **Event type**: Which event should trigger this hook?
- **When**: Before or after the event?
- **Action**: What command/script to run?
- **Filtering**: Specific tools, file types, or conditions?
- **Location**: Project-local or global?

### 2. Generate Hook Configuration

**Location:**

- Global: `~/.claude/skills/super-claude/plugins/[plugin]/hooks/hooks.json`
- Project: `/path/to/project/.claude/hooks/hooks.json`

**Format:**

```json
{
  "hooks": [
    {
      "name": "hook-name",
      "event": "event-type",
      "when": "before|after",
      "command": "shell command to execute",
      "filter": {
        "tool": "specific-tool-name",
        "filePattern": "*.ts"
      },
      "description": "What this hook does"
    }
  ]
}
```

### 3. Validate Hook

Ensure:

- ✅ Event type is valid
- ✅ Command is executable
- ✅ Filter criteria are specific
- ✅ Hook has clear description
- ✅ No security issues (careful with shell commands)

## Example Hooks

### Prettier on Save

```json
{
  "hooks": [
    {
      "name": "format-on-save",
      "event": "tool-call",
      "when": "after",
      "command": "prettier --write $FILE",
      "filter": {
        "tool": "Write",
        "filePattern": "*.{ts,tsx,js,jsx,md,json}"
      },
      "description": "Automatically format files after writing"
    }
  ]
}
```

### Type Check Before Commit

```json
{
  "hooks": [
    {
      "name": "type-check-pre-commit",
      "event": "user-prompt-submit",
      "when": "before",
      "command": "npm run type-check",
      "filter": {
        "promptPattern": "commit|create.*commit"
      },
      "description": "Run type check before git commits"
    }
  ]
}
```

### Run Tests After Edit

```json
{
  "hooks": [
    {
      "name": "test-after-edit",
      "event": "tool-call",
      "when": "after",
      "command": "npm test -- --related $FILE --run",
      "filter": {
        "tool": "Edit",
        "filePattern": "*.{ts,tsx}"
      },
      "description": "Run related tests after editing source files"
    }
  ]
}
```

### Validate API Schema

```json
{
  "hooks": [
    {
      "name": "validate-openapi-schema",
      "event": "tool-call",
      "when": "after",
      "command": "npm run validate:openapi",
      "filter": {
        "tool": "Write",
        "filePattern": "**/api/**/*.ts"
      },
      "description": "Validate OpenAPI schema after API changes"
    }
  ]
}
```

### Accessibility Check

```json
{
  "hooks": [
    {
      "name": "a11y-check-components",
      "event": "tool-call",
      "when": "after",
      "command": "npm run a11y:check $FILE",
      "filter": {
        "tool": "Write",
        "filePattern": "**/components/**/*.tsx"
      },
      "description": "Run accessibility checks on component changes"
    }
  ]
}
```

### Session Start Setup

```json
{
  "hooks": [
    {
      "name": "session-start-checks",
      "event": "session-start",
      "when": "after",
      "command": "./scripts/check-dependencies.sh",
      "description": "Check dependencies and environment on session start"
    }
  ]
}
```

## Hook Configuration

### Event Types

**user-prompt-submit**

- Triggers when user submits a prompt
- Use `when: "before"` to validate/modify input
- Use `when: "after"` to log/process completed requests

**tool-call**

- Triggers on tool execution (Read, Write, Edit, Bash, etc.)
- Use `filter.tool` to specify which tool
- Access file path via `$FILE` variable

**session-start**

- Triggers when Claude Code session begins
- Good for environment checks, setup tasks

**session-end**

- Triggers when session ends
- Good for cleanup, logging, backups

### Filter Options

```json
{
  "filter": {
    "tool": "Write",                    // Specific tool name
    "filePattern": "*.ts",              // Glob pattern for files
    "promptPattern": "commit|deploy",   // Regex for prompt content
    "fileType": "typescript"            // File type detection
  }
}
```

### Variables

Available in commands:

- `$FILE` - File path being operated on
- `$TOOL` - Tool name being used
- `$PROJECT` - Project root directory
- `$PWD` - Current working directory

## Hook Categories

### Code Quality

- Format on save (Prettier, ESLint --fix)
- Lint before commit
- Type check before operations

### Testing

- Run tests after edits
- Update snapshots
- Coverage checks

### Validation

- Schema validation
- API contract checking
- Accessibility testing

### Git Operations

- Pre-commit checks
- Commit message validation
- Branch protection

### Environment

- Dependency checks
- Environment variable validation
- Configuration verification

## Best Practices

1. **Specific Filters**: Don't run on every event - be selective
2. **Fast Commands**: Hooks should complete quickly (< 2 seconds)
3. **Error Handling**: Commands should fail gracefully
4. **Clear Descriptions**: Explain what the hook does
5. **Test Hooks**: Verify they work before deploying

## Security Considerations

⚠️ **Important**: Hooks execute shell commands

- ✅ Use absolute paths when possible
- ✅ Validate inputs and file paths
- ✅ Avoid user-controlled variables in commands
- ✅ Review hook commands carefully
- ❌ Never execute arbitrary code from untrusted sources
- ❌ Avoid hooks that modify system files
- ❌ Don't use hooks for sensitive operations without safeguards

## Anti-Patterns

- ❌ Running slow operations (> 5 seconds)
- ❌ Hooks with side effects that aren't clear
- ❌ Too many hooks (performance impact)
- ❌ Hooks without filters (run on everything)
- ❌ Destructive operations without confirmation

## Troubleshooting

### Hook Not Firing

**Solution**:

- Check hooks.json syntax is valid
- Verify event type is correct
- Check filter criteria match your use case
- Restart Claude Code

### Hook Command Fails

**Solution**:

- Test command in terminal first
- Check file paths are correct
- Verify required tools are installed
- Check command output/errors

### Hook Slows Down Workflow

**Solution**:

- Add more specific filters
- Optimize command execution
- Consider running async if possible
- Remove unnecessary hooks

## Advanced Patterns

### Conditional Execution

```json
{
  "name": "conditional-hook",
  "event": "tool-call",
  "when": "after",
  "command": "if [ -f package.json ]; then npm test; fi",
  "description": "Run tests only if package.json exists"
}
```

### Chained Commands

```json
{
  "name": "format-and-lint",
  "event": "tool-call",
  "when": "after",
  "command": "prettier --write $FILE && eslint --fix $FILE",
  "filter": {
    "tool": "Write",
    "filePattern": "*.ts"
  },
  "description": "Format and lint TypeScript files"
}
```

### Background Execution

```json
{
  "name": "background-validation",
  "event": "tool-call",
  "when": "after",
  "command": "npm run validate &",
  "description": "Run validation in background"
}
```

## References

- [Claude Code Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [super-claude Hook Examples](../../hooks/)
