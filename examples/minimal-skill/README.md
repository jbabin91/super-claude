# Minimal Skill Example

A minimal skill demonstrating the required structure and best practices for Claude Code skills.

## What This Example Shows

- ✅ Required YAML frontmatter fields
- ✅ Skill activation triggers (keywords and patterns)
- ✅ Token-efficient design (<500 lines)
- ✅ Clear, actionable instructions
- ✅ Structured markdown format

## When to Use This Example

- Starting a new skill from scratch
- Learning the basic skill structure
- Need a quick reference for frontmatter fields
- Want to ensure ADR-0009 compliance

## File Structure

```txt
minimal-skill/
├── README.md          # This file
└── SKILL.md           # Complete skill implementation
```

## How to Use

### 1. Copy to Your Plugin

```sh
# Copy to your plugin's skills directory
cp examples/minimal-skill/SKILL.md plugins/your-plugin/skills/your-skill-name/SKILL.md
```

### 2. Customize for Your Use Case

Edit the copied SKILL.md:

```yaml
---
name: your-skill-name # Change this
description: | # Change this
  What your skill does and when to use it
triggers:
  keywords: [your, keywords] # Change these
  patterns: ['your.*patterns'] # Change these
---
```

### 3. Update the Instructions

Replace the example instructions with your skill's logic:

- Define what the skill should do
- Provide clear steps and patterns
- Include examples where helpful
- Keep it focused and concise

### 4. Validate

```sh
# Validate skill structure
bun run scripts/validate-skill-structure.ts --plugin your-plugin
```

## Key Features

### Token Efficiency

This example follows ADR-0009 (Token-Efficient Skill Design):

- Core instructions in SKILL.md
- Under 500 lines (excluding frontmatter)
- Focused on frequently-used patterns
- Resource files for advanced topics (if needed)

### Auto-Activation

Configured triggers enable automatic skill activation:

- **Keywords**: Simple word matching
- **Patterns**: Regex for flexible matching

### Required Fields

All required frontmatter fields included:

- `name` - Unique skill identifier
- `version` - Semantic versioning
- `description` - What, when, and how
- `category` - Skill classification
- `tags` - Searchable labels
- `triggers` - Auto-activation config

## Adaptation Guide

### Adding Resource Files

If your skill grows beyond 500 lines, split it:

```txt
your-skill-name/
├── SKILL.md              # Core patterns (<500 lines)
├── API_REFERENCE.md      # Advanced topics
└── EXAMPLES.md           # Detailed examples
```

Reference from SKILL.md:

```markdown
## Advanced Usage

For advanced patterns, see [API_REFERENCE.md](./API_REFERENCE.md).
For complete examples, see [EXAMPLES.md](./EXAMPLES.md).
```

### Customizing Triggers

Match your skill's use case:

```yaml
triggers:
  keywords:
    - task-specific-word
    - another-keyword
  patterns:
    - 'help.*with.*X'
    - 'create.*Y'
    - 'generate.*Z'
```

### Setting Model

Choose appropriate model for your skill:

- `sonnet` - Default, best for most tasks
- `haiku` - Fast, simple tasks
- `opus` - Complex reasoning (rare)

```yaml
model: sonnet # or haiku, opus
```

## Testing Your Skill

### 1. Manual Testing

Install your plugin and trigger the skill:

```sh
# In Claude Code, try phrases matching your triggers
"help me with [skill-topic]"
"create a [skill-output]"
```

### 2. Validation

```sh
# Check structure compliance
bun run scripts/validate-skill-structure.ts --plugin your-plugin
```

### 3. Iteration

If the skill doesn't activate or behave correctly:

1. Check trigger keywords/patterns
2. Verify frontmatter is valid
3. Review instruction clarity
4. Test with different phrasings

## Common Pitfalls

### ❌ Vague Instructions

```markdown
Do the thing with the stuff.
```

### ✅ Clear Instructions

```markdown
When generating components:

1. Create component file with TypeScript
2. Include props interface
3. Add JSDoc comments
4. Export as default
```

### ❌ Too Many Triggers

```yaml
triggers:
  keywords: [help, create, generate, make, build, do, ...] # 50+ keywords
```

### ✅ Focused Triggers

```yaml
triggers:
  keywords: [component, generate-component]
  patterns: ['create.*component', 'generate.*component']
```

### ❌ Exceeding Token Budget

SKILL.md with 2000+ lines of content

### ✅ Token-Efficient Design

- Core patterns: 300-400 lines
- Advanced topics: API_REFERENCE.md
- Examples: EXAMPLES.md

## Related Documentation

- [ADR-0009: Token-Efficient Skill Design](../../docs/architecture/decisions/ADR-0009-token-efficient-skill-design.md)
- [ADR-0007: Skill Auto-Activation](../../docs/architecture/decisions/ADR-0007-skill-auto-activation.md)
- [Skill Activation Guide](../../docs/guides/skill-activation.md)

## Next Steps

After mastering this minimal example:

1. Review [advanced-skill-with-resources](../advanced-skill-with-resources/) for progressive disclosure
2. Check [command-hook-example](../command-hook-example/) for validation hooks
3. Explore existing skills in `plugins/*/skills/` for real-world patterns

## Support

If you encounter issues:

1. Validate with `bun run scripts/validate-skill-structure.ts`
2. Check [docs/guides/skill-activation.md](../../docs/guides/skill-activation.md)
3. Review similar skills in existing plugins
