# Skill Development Guide

Comprehensive guide to creating, testing, and refining Claude Code skills.

## RED-GREEN-REFACTOR Methodology

**ALWAYS follow RED-GREEN-REFACTOR when creating skills:**

### 1. RED Phase

**Goal:** Document what doesn't work without the skill

- Run scenarios WITHOUT the skill active
- Document failures and agent rationalizations
- Identify specific problems to solve
- Capture exact behaviors you want to prevent

**Example:**

```markdown
❌ WITHOUT SKILL: Claude creates test files in wrong location
❌ WITHOUT SKILL: Claude uses .test.ts instead of .stories.tsx for components
❌ WITHOUT SKILL: Claude forgets to add accessibility tests
```

### 2. GREEN Phase

**Goal:** Write minimal skill that addresses failures

- Write minimal skill addressing failures
- Use skill-creator from meta plugin
- Test that Claude complies with skill
- Verify skill solves documented problems

**Example:**

```markdown
✅ WITH SKILL: Claude creates tests in .stories.tsx for components
✅ WITH SKILL: Claude adds accessibility validation
✅ WITH SKILL: Claude follows correct file structure
```

### 3. REFACTOR Phase

**Goal:** Harden skill against rationalizations

- Identify new rationalizations or edge cases
- Add explicit counters and guards
- Re-test until bulletproof
- Document any remaining limitations

**Example:**

```markdown
🔒 HARDENED: Added explicit "NEVER create .test.ts for UI components"
🔒 HARDENED: Added "ALWAYS include WCAG AAA checks in stories"
🔒 HARDENED: Added examples showing correct vs incorrect patterns
```

**Never deploy untested skills!**

## Skill File Format

### Required YAML Frontmatter

```yaml
---
name: skill-identifier # kebab-case, no -skill suffix
version: 1.0.0 # semantic versioning
description: |
  What it does + when to use + activation triggers
category: workflow-automation
tags: [tag1, tag2]
model: sonnet # sonnet | haiku | opus
requires:
  tools: [git, npm] # External dependencies
triggers:
  keywords: [keyword1, keyword2]
  patterns: ['pattern1']
---
```

### Field Descriptions

**Required Fields:**

- `name` - Unique identifier (kebab-case, no `-skill` suffix)
- `version` - Semantic version (MAJOR.MINOR.PATCH)
- `description` - What it does, when to use, activation triggers
- `category` - Primary category (e.g., workflow-automation, testing, documentation)
- `tags` - Searchable tags for discovery

**Optional Fields:**

- `model` - Preferred model (sonnet, haiku, opus)
- `requires.tools` - External tool dependencies
- `triggers.keywords` - Keywords for auto-activation
- `triggers.patterns` - Regex patterns for auto-activation

### Skill Content Structure

```markdown
---
[frontmatter]
---

# Skill Name

Brief description of what the skill does.

## When to Use

- Scenario 1
- Scenario 2
- Scenario 3

## Instructions

### Core Behavior

Clear, imperative instructions:

- ALWAYS do this
- NEVER do that
- Use X instead of Y

### Examples

Good vs bad examples showing correct behavior.

## Anti-Patterns

Explicit list of what NOT to do.

## Validation

How to verify skill is working correctly.
```

## Progressive Disclosure

Keep skills token-efficient using progressive disclosure pattern:

### Two-File Pattern

**SKILL.md** (< 500 lines)

- Core instructions always loaded
- Essential patterns and rules
- Quick reference examples
- Common use cases

**API_REFERENCE.md** (loaded on-demand)

- Advanced topics
- Edge cases
- Detailed API documentation
- Extended examples

### Token Targets

- **Frequently-loaded skills:** < 500 words
- **Specialized skills:** < 1000 words
- **Complex skills:** Use progressive disclosure

### Example Split

**SKILL.md:**

```markdown
# Component Generator

Generate Base UI components with Storybook.

## Core Instructions

- ALWAYS create .stories.tsx file
- ALWAYS include accessibility tests
- Use Base UI, not Radix UI

## Quick Examples

[3-4 common examples]
```

**API_REFERENCE.md:**

```markdown
# Component Generator - API Reference

## Advanced Patterns

[Detailed examples]

## Base UI Component APIs

[Complete API documentation]

## Accessibility Testing

[Comprehensive WCAG AAA guide]
```

**Token savings:** ~2.5x reduction for main skill file!

## Universal Executor Pattern

For skills that generate and execute code (testing, CLI validation):

```javascript
// run.js - Universal executor
export async function execute(code, context) {
  // 1. Create temp file with proper module context
  const tempFile = await createTempFile(code, context);

  // 2. Set up environment with dependencies
  const env = setupEnvironment(context);

  // 3. Execute with proper module resolution
  const result = await executeCode(tempFile, env);

  // 4. Parse results
  const parsed = parseResults(result);

  // 5. Clean up without race conditions
  await cleanup(tempFile);

  return parsed;
}
```

### Use Cases

- Test framework execution (Vitest, Playwright)
- CLI validation
- Code generation with execution
- Interactive examples

### Key Requirements

1. **Temp file isolation** - No conflicts between runs
2. **Proper module context** - ESM/CJS handling
3. **Environment setup** - Dependencies available
4. **Safe cleanup** - No race conditions
5. **Error handling** - Parse and report failures

See `RESEARCH_FINDINGS.md` → "playwright-skill" section for complete pattern.

## Skill Quality Standards

### 1. Progressive Disclosure

- SKILL.md < 500 lines
- Advanced topics in API_REFERENCE.md
- Token-efficient structure

### 2. Universal Executor Pattern

- For test frameworks
- For CLI testing
- Safe execution environment

### 3. RED-GREEN-REFACTOR

- Document failures first
- Minimal implementation
- Harden against rationalizations

### 4. Context-Aware Activation

- Auto-trigger via keywords/patterns
- No manual invocation needed
- Clear activation criteria

### 5. Token Efficiency

- < 500 words for frequently-loaded
- < 1000 words for specialized
- Progressive disclosure for complex

## Testing Skills

### Manual Testing

1. **Deactivate skill** - Test behavior without skill
2. **Document failures** - Capture what goes wrong
3. **Activate skill** - Enable and test again
4. **Verify compliance** - Confirm skill is followed
5. **Test edge cases** - Try to break it
6. **Iterate** - Refine based on failures

### Automated Validation

```bash
# Validate skill frontmatter
bun run validate

# Check markdown formatting
bun run lint:md

# Full validation
bun run validate:verbose
```

### Testing Checklist

```markdown
- [ ] Skill follows RED-GREEN-REFACTOR
- [ ] YAML frontmatter valid
- [ ] Markdown formatting correct
- [ ] Examples show good vs bad patterns
- [ ] Anti-patterns explicitly called out
- [ ] Tested manually in Claude Code
- [ ] Edge cases handled
- [ ] Token count reasonable
- [ ] Auto-activation triggers defined
- [ ] Documentation updated
```

## Common Pitfalls

### ❌ Writing Skills Before Testing

**Problem:** Skill doesn't address actual failures

**Solution:** Always run RED phase first!

### ❌ Vague Instructions

**Problem:** "Try to use Base UI" → Claude ignores

**Solution:** "ALWAYS use Base UI. NEVER use Radix UI."

### ❌ No Examples

**Problem:** Claude misinterprets instructions

**Solution:** Show good vs bad examples

### ❌ Untested Skills

**Problem:** Skill doesn't work in practice

**Solution:** Test thoroughly before committing

### ❌ Token Bloat

**Problem:** 2000+ line skills consume too much context

**Solution:** Use progressive disclosure pattern

## Skill Templates

### Basic Skill Template

```markdown
---
name: skill-name
version: 1.0.0
description: What it does
category: workflow-automation
tags: [tag1, tag2]
---

# Skill Name

What this skill does.

## When to Use

- Trigger 1
- Trigger 2

## Instructions

- ALWAYS do X
- NEVER do Y

## Examples

Good vs bad patterns.
```

### Complex Skill Template

Use skill-creator from meta plugin:

```bash
# In Claude Code
"Create a skill for [purpose]"

# The skill-creator will guide you through:
# - Skill structure and YAML frontmatter
# - When to use and activation triggers
# - Best practices and validation
```

## Related Documentation

- **[Plugin Structure Standards](../standards/plugin-structure.md)** - Naming conventions, directory organization, validation
- **[Skill Activation Guide](skill-activation.md)** - Auto-activation system and triggers
- **[Testing Standards](../standards/testing.md)** - Testing philosophy, stories-based testing, file generation
- **[Markdown Standards](../standards/markdown.md)** - Formatting rules for skill documentation
