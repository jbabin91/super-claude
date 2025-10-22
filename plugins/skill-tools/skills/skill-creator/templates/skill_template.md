---
# ============================================================================
# OFFICIAL CLAUDE CODE FIELDS
# Reference: https://docs.claude.com/en/docs/claude-code/skills.md
# ============================================================================

name: skill-identifier # Required: kebab-case, unique identifier
description: | # Required: What the skill does and when to use it
  Brief description of what this skill does and when to use it.
  Include activation triggers: "Use when...", "Activates when user says..."
  Keep concise but searchable.

allowed-tools: [] # Optional: Restrict to specific tools (Read, Write, Edit, Bash, Grep, Glob, etc.)
# Example: allowed-tools: [Read, Grep, Glob] # Read-only skill

# ============================================================================
# COMMUNITY ENHANCEMENTS (super-claude)
# These fields enhance organization and discoverability but are not required
# ============================================================================

version: 1.0.0 # Track changes with semantic versioning
category: workflow-automation # Primary category for organization
tags: [tag1, tag2, tag3] # Searchable tags for discoverability
model: sonnet # Preferred Claude model: sonnet (default) | haiku (fast) | opus (complex)

# Explicit activation hints (helps Claude know when to invoke this skill)
triggers:
  keywords: [keyword1, keyword2] # Words that should activate this skill
  patterns: ['pattern1', 'pattern2'] # Regex patterns for activation
  contexts: [development, testing] # Contexts where this skill is relevant

# Optional metadata
author: Your Name
license: MIT
homepage: https://github.com/jbabin91/super-claude
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

### Official vs Community Fields

**Official Fields (Required by Claude Code):**

- `name` - Skill identifier
- `description` - What it does and when to activate

**Official Fields (Optional):**

- `allowed-tools` - Restrict tools (e.g., `[Read, Grep, Glob]` for read-only)

**Community Enhancements (super-claude):**

- `version`, `category`, `tags` - Organization and tracking
- `model` - Performance tuning (haiku=fast, sonnet=balanced, opus=complex)
- `triggers` - Explicit activation hints for better discoverability

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

Claude autonomously decides when to use skills based on:

1. **Description content** - Include trigger words users would say
2. **Trigger keywords** - Explicit words that should activate
3. **Context relevance** - File types, project structure, user intent

**Good description:**

> "Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with .xlsx files or data analysis requests."

**Bad description:**

> "Helps with data" (too vague, lacks triggers)

### Model Selection

- **haiku** - Simple, repetitive tasks (formatting, validation)
- **sonnet** - Most skills (balanced speed/quality)
- **opus** - Complex reasoning (architecture, research)

### Tool Restrictions

Use `allowed-tools` to create read-only or limited-permission skills:

```yaml
allowed-tools: [Read, Grep, Glob] # Read-only, no file modifications
```

Available tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task, etc.
