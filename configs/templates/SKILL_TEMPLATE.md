---
# REQUIRED FIELDS
name: skill-identifier              # kebab-case, unique within category
version: 1.0.0                      # Semantic versioning
description: |
  Brief description of what this skill does and when to use it.
  Include activation triggers: "Use when...", "Activates when user says..."
  Keep concise but searchable.

# OPTIONAL FIELDS
category: workflow-automation       # Primary category
tags: [tag1, tag2, tag3]           # Searchable tags
author: Your Name
license: MIT
homepage: https://github.com/jbabin91/super-claude
model: sonnet                       # Preferred Claude model (sonnet/haiku/opus)

# DEPENDENCIES
requires:
  skills: []                        # Other skills this depends on
  agents: []                        # Agents this skill may invoke
  tools: []                         # External tools required (git, npm, etc.)

# ACTIVATION
triggers:
  keywords: [keyword1, keyword2]
  patterns: ["pattern1", "pattern2"]
  contexts: [development, testing]
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
3. Success criteria

## Integration Points

- **Works with:** Other skills this coordinates with
- **Calls:** Agents or tools this skill may invoke
- **Prerequisites:** Skills that should be available

## Troubleshooting

### Common Issue 1

**Problem:** Description of the issue
**Solution:** How to resolve it

### Common Issue 2

**Problem:** Another common problem
**Solution:** Fix or workaround

## Advanced Usage

For advanced scenarios and edge cases, see [API_REFERENCE.md](./API_REFERENCE.md) (optional).

## References

- [External documentation link](https://example.com)
- [Related skill](../related-skill/SKILL.md)
- [Tool documentation](https://tool-docs.example.com)

---

**Token Efficiency Target:** < 500 lines for SKILL.md, detailed content in API_REFERENCE.md
