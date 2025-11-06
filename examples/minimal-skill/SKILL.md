---
name: minimal-example
version: 1.0.0
description: |
  Example skill demonstrating required structure and best practices.
  Use this as a template for creating new skills.
  Activates when user mentions example, template, or minimal patterns.
category: example
tags: [template, reference, minimal]
model: sonnet
requires:
  tools: []
triggers:
  keywords:
    - example
    - template
    - minimal-skill
  patterns:
    - 'show.*example'
    - 'create.*from.*template'
---

# Minimal Skill Example

This is an example skill demonstrating the minimal required structure for Claude Code skills.

## Purpose

This skill serves as a reference implementation showing:

- Required YAML frontmatter fields
- Token-efficient design (<500 lines)
- Clear instruction structure
- Auto-activation triggers

## When This Skill Activates

Automatically activates when you mention:

- "example" or "template"
- "show me an example"
- "create from template"
- "minimal-skill"

## What This Skill Does

When activated, Claude should:

1. Acknowledge the skill activation
2. Provide relevant examples or templates
3. Explain how to adapt the example
4. Offer next steps

## Instructions

### Core Behavior

When this skill is active, follow these patterns:

**For Example Requests:**

- Identify what type of example is needed
- Provide complete, working code
- Include inline comments explaining key parts
- Suggest related examples

**For Template Requests:**

- Show the template structure
- Explain each section's purpose
- Provide adaptation instructions
- Link to related documentation

### Response Format

Use this structure for responses:

```markdown
Here's [what was requested]:

[Code/template with comments]

**Key points:**

- Point 1
- Point 2
- Point 3

**To adapt this:**

1. Step 1
2. Step 2
3. Step 3

**Related:**

- [Link to related resource]
```

### Examples

**Example 1: Providing Code Template**

When user asks: "Show me a TypeScript function example"

```typescript
/**
 * Example function demonstrating TypeScript patterns
 * @param input - The input value
 * @returns Processed result
 */
export function processData(input: string): string {
  // Validate input
  if (!input || input.trim().length === 0) {
    throw new Error('Input cannot be empty');
  }

  // Process and return
  return input.trim().toLowerCase();
}
```

**Key points:**

- JSDoc comments for documentation
- Type annotations for safety
- Input validation
- Clear error handling

**Example 2: Providing File Structure**

When user asks: "Show me a minimal skill structure"

```txt
skill-name/
├── SKILL.md              # Main skill file (<500 lines)
├── API_REFERENCE.md      # Advanced topics (optional)
└── EXAMPLES.md           # Detailed examples (optional)
```

**Key points:**

- SKILL.md is required
- Resource files are optional
- Keep SKILL.md under 500 lines

## Guidelines

### Do's

- ✅ Provide complete, working examples
- ✅ Include explanatory comments
- ✅ Suggest adaptation steps
- ✅ Link to related resources
- ✅ Keep responses focused and concise

### Don'ts

- ❌ Provide incomplete or broken examples
- ❌ Skip error handling
- ❌ Use overly complex patterns unnecessarily
- ❌ Forget to explain why, not just what
- ❌ Include unrelated information

## Advanced Topics

For more complex patterns, consider:

- Progressive disclosure (SKILL.md + API_REFERENCE.md)
- Universal executor pattern for test frameworks
- Token optimization strategies
- Context-aware triggers

See [API_REFERENCE.md](./API_REFERENCE.md) for details.

## Related Skills

- **skill-creator** - Generate new skills with proper structure
- **command-creator** - Create custom slash commands
- **agent-creator** - Build specialized agents

## Troubleshooting

**Skill not activating?**

- Check trigger keywords in your message
- Verify frontmatter is valid YAML
- Use explicit skill name if needed

**Examples not helpful?**

- Be more specific about what you need
- Provide context about your use case
- Ask for alternative approaches

## Integration with Other Tools

This skill works well with:

- `scripts/validate-skill-structure.ts` - Validate your skills
- `/plugin install meta` - Access skill-creator
- OpenSpec workflow - Plan and implement features

## Best Practices

### Token Efficiency

- Keep core instructions in SKILL.md
- Move advanced topics to API_REFERENCE.md
- Target 300-400 lines for frequently-used skills
- Use progressive disclosure for complex skills

### Auto-Activation

- Choose specific, relevant keywords
- Use patterns for flexible matching
- Avoid overly broad triggers
- Test with realistic user messages

### Maintainability

- Use clear, descriptive names
- Include version in frontmatter
- Document breaking changes
- Update examples when patterns change

## Version History

- **1.0.0** (2025-11-06) - Initial minimal example

## References

- [ADR-0009: Token-Efficient Skill Design](../../docs/architecture/decisions/ADR-0009-token-efficient-skill-design.md)
- [ADR-0007: Skill Auto-Activation](../../docs/architecture/decisions/ADR-0007-skill-auto-activation.md)
- [Skill Activation Guide](../../docs/guides/skill-activation.md)
