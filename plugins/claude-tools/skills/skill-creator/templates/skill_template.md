---
# ============================================================================
# OFFICIAL CLAUDE CODE FIELDS (recognized by Claude Code)
# Reference: https://docs.claude.com/en/docs/claude-code/skills.md
# ============================================================================

name: skill-identifier # Required: kebab-case, unique identifier
description: | # Required: What it does AND when to activate it
  Brief description of what this skill does and when to use it.
  IMPORTANT: Include activation triggers in the description itself since
  Claude Code only uses the description field for discovery.

  Examples: "Use when...", "Activates for...", "Helps with..."
  Good: "Generate React components with TypeScript. Use when creating new UI components."
  Bad: "Helps with components" (too vague)

allowed-tools: [] # Optional: Restrict to specific tools
# Example: allowed-tools: [Read, Grep, Glob] # Read-only skill
# Available tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task, etc.

# ============================================================================
# EXTENDED METADATA (not used by Claude Code, but useful for humans/tooling)
# These fields are ignored by Claude Code but help with organization
# ============================================================================

version: 1.0.0 # Track changes since skills are files, not versioned packages
---

# Skill Name

Brief overview of what this skill does (1-2 sentences maximum).

## When to Use

- User action or request that triggers this skill
- Specific scenario where this skill is helpful
- Problem this skill solves

## Prerequisites

- Required tools/setup (if any)
- Expected environment or configuration
- Dependencies that must be installed

## Core Workflow

### 1. Step One

Description of first step with details.

```bash
# Example command or code
example-command --flag value
```

### 2. Step Two

Description of second step with examples.

### 3. Step Three

Final steps and completion criteria.

## Best Practices

- Practice 1: Why and when to apply it
- Practice 2: Common pitfall to avoid
- Practice 3: Optimization or efficiency tip

## Example Workflows

### Scenario 1: [Common Use Case]

**User Request:** "Help me do X"

**Steps:**

1. First action
2. Second action
3. Expected outcome

**Example:**

```typescript
// Example code demonstrating the workflow
function example() {
  // ...
}
```

### Scenario 2: [Advanced Use Case]

**User Request:** "I need to handle Y edge case"

**Steps:**

1. Handle edge case
2. Validate result
3. Confirm success

## Troubleshooting

### Issue 1: Common Problem

**Symptom:** What the user sees

**Solution:**

- Step 1 to fix
- Step 2 to verify
- Alternative approach if needed

### Issue 2: Another Problem

**Symptom:** What the user sees

**Solution:**

- How to resolve
- How to prevent in future

## References

- [Related Documentation](https://example.com)
- [Official Guide](https://example.com)
- [Community Resources](https://example.com)

---

## Template Notes (Remove before publishing)

### What Claude Code Actually Uses

**Claude Code ONLY recognizes these fields:**

- `name` - Skill identifier (required)
- `description` - What it does AND when to activate (required)
- `allowed-tools` - Tool restrictions (optional)

**Extended metadata (ignored by Claude Code, but useful for humans):**

- `version` - Track changes since skills are files, not versioned packages

Note: Author info is in the plugin's `plugin.json`, not individual skill files.

All activation hints, keywords, and patterns should go directly in the `description` field since that's the only field Claude Code uses for skill discovery.

### File Organization

Skills can have supporting files loaded progressively:

```sh
skill-name/
├── SKILL.md (this file, required)
├── reference.md (optional, advanced topics)
├── examples.md (optional, detailed examples)
├── scripts/ (optional, helper scripts)
└── templates/ (optional, code templates)
```

### Activation Best Practices

**Claude Code only uses the `description` field for discovery!**

Put ALL activation hints directly in the description:

```yaml
description: |
  Generate React components with TypeScript and Tailwind CSS.
  Use when: creating new components, scaffolding UI elements, building design system.
  Activates for: "create component", "new component", "generate component"
```

**Good description examples:**

> "Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with .xlsx files or data analysis requests."
>
> "Refactor TypeScript imports, organize import statements, remove unused imports. Use when cleaning up imports or seeing import-related errors."

**Bad description (too vague):**

> "Helps with data" ❌ - No activation triggers, no use cases

### Model Selection

Claude Code automatically picks the appropriate model. The `model` field in YAML is ignored.

### Tool Restrictions

Use `allowed-tools` to create read-only or limited-permission skills:

```yaml
allowed-tools: [Read, Grep, Glob] # Read-only, no file modifications
```

Available tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task, etc.
