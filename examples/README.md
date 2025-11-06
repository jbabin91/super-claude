# Examples

Reference implementations demonstrating super-claude patterns and best practices.

## Purpose

This directory contains complete, working examples of:

- **Skills** - Complete skill implementations with progressive disclosure
- **Hooks** - Command and prompt hook examples
- **Agents** - Specialized agent implementations
- **Commands** - Custom slash command examples
- **Integrations** - Plugin integration patterns

## Quick Start

Browse examples by category, copy the patterns you need, and adapt them for your use case.

## Available Examples

### Skills

#### minimal-skill/

A minimal skill demonstrating the basic structure:

- SKILL.md with required frontmatter
- Trigger keywords and patterns
- Progressive disclosure pattern
- Token-efficient design

**Use when:** Creating a new skill from scratch

#### advanced-skill-with-resources/

Complete skill with progressive disclosure:

- SKILL.md (<500 lines, core patterns)
- API_REFERENCE.md (advanced topics)
- EXAMPLES.md (detailed examples)
- Proper frontmatter and triggers

**Use when:** Building a complex skill with advanced topics

### Hooks

#### command-hook-example/

Simple command hook demonstrating:

- TypeScript implementation with Bun
- Stdin parsing
- Exit codes (0 = pass, 1 = block)
- Error messaging

**Use when:** Creating validation or checking hooks

#### prompt-hook-example/

Prompt hook configuration showing:

- JSON configuration format
- Prompt template structure
- Response handling
- Decision outcomes

**Use when:** Semantic analysis or quality checks needed

### Agents

#### simple-agent/

Basic agent implementation:

- Clear task definition
- Tool usage patterns
- Error handling
- Output formatting

**Use when:** Creating specialized task agents

### Commands

#### slash-command-example/

Custom slash command showing:

- Markdown format
- Parameter handling
- Integration with tools
- User feedback

**Use when:** Creating custom workflows

## Example Structure

Each example follows this structure:

```txt
examples/
└── example-name/
    ├── README.md           # What it does, when to use, how to adapt
    ├── implementation/     # Complete implementation files
    │   ├── SKILL.md       # For skills
    │   ├── hook.ts        # For command hooks
    │   ├── hook.json      # For prompt hooks
    │   └── command.md     # For commands
    └── tests/             # Example tests (if applicable)
        └── *.test.ts
```

## Using Examples

### 1. Copy the Pattern

```sh
# Copy skill example
cp -r examples/minimal-skill plugins/my-plugin/skills/my-skill

# Copy hook example
cp examples/command-hook-example/hook.ts plugins/my-plugin/hooks/my-hook.ts
```

### 2. Adapt for Your Use Case

- Update names and descriptions
- Modify logic for your requirements
- Update frontmatter/configuration
- Add tests if needed

### 3. Validate

```sh
# Validate skill structure
bun run scripts/validate-skill-structure.ts --plugin my-plugin

# Test hook locally
bun run plugins/my-plugin/hooks/my-hook.ts < test-input.json
```

## Example Categories

### By Complexity

- **Minimal** - Bare bones structure, best for learning
- **Standard** - Typical implementation with common features
- **Advanced** - Complex patterns with edge case handling

### By Purpose

- **Learning** - Educational examples with detailed comments
- **Production** - Battle-tested patterns ready for use
- **Reference** - Complete implementations showing best practices

### By Technology

- **TypeScript** - Type-safe implementations
- **JSON** - Configuration-based examples
- **Markdown** - Documentation and commands

## Best Practices

### When Copying Examples

- Don't copy blindly - understand the pattern first
- Adapt to your specific use case
- Update all names and identifiers
- Test thoroughly before deploying

### When Creating Examples

- Keep examples focused (one pattern per example)
- Include comprehensive README
- Add inline comments explaining why, not just what
- Test example works as-is before committing
- Update this index when adding new examples

### Documentation

Each example MUST include:

- **README.md** - What, when, how
- **Implementation files** - Complete, working code
- **Usage instructions** - How to run/test locally
- **Adaptation guide** - How to customize for specific needs

## Testing Examples

Examples should be self-contained and testable:

```sh
# Test command hook
echo '{"tool": "Edit", "args": {...}}' | bun run examples/command-hook-example/hook.ts

# Validate skill example
bun run scripts/validate-skill-structure.ts --plugin examples/minimal-skill

# Run example tests
bun test examples/*/tests/*.test.ts
```

## Contributing Examples

When adding new examples:

1. Create directory under appropriate category
2. Include complete implementation files
3. Write comprehensive README
4. Test example works as-is
5. Update this index with entry
6. Consider adding to CI validation

## Related Documentation

- [Scripts](../scripts/README.md) - Utility scripts and validation
- [Architecture Decisions](../docs/architecture/INDEX.md) - ADR catalog
- [Development Guide](../docs/workflows/development.md) - Development workflow
- [OpenSpec Workflow](../docs/workflows/openspec.md) - Spec-driven development

## Quick Links

### By Skill Type

- Minimal skill: [minimal-skill/](minimal-skill/)
- Advanced skill: [advanced-skill-with-resources/](advanced-skill-with-resources/)

### By Hook Type

- Command hook: [command-hook-example/](command-hook-example/)
- Prompt hook: [prompt-hook-example/](prompt-hook-example/)

### By Pattern

- Progressive disclosure: [advanced-skill-with-resources/](advanced-skill-with-resources/)
- Universal executor: Coming soon
- Token efficiency: [minimal-skill/](minimal-skill/)

## Example Status

| Example                       | Status | Last Updated | Complexity |
| ----------------------------- | ------ | ------------ | ---------- |
| minimal-skill                 | ✅     | 2025-11-06   | Minimal    |
| command-hook-example          | ✅     | 2025-11-06   | Minimal    |
| advanced-skill-with-resources | 📋     | Planned      | Advanced   |
| prompt-hook-example           | 📋     | Planned      | Standard   |
| simple-agent                  | 📋     | Planned      | Standard   |
| slash-command-example         | 📋     | Planned      | Minimal    |

Legend:

- ✅ Ready - Complete and tested
- 🚧 In Progress - Under development
- 📋 Planned - On roadmap
