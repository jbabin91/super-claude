# Creating Skills

Guide to building effective Claude Code skills based on community best practices.

## Quick Start

**Option 1: Use skill-creator (Recommended)**

```bash
# Install skill-tools plugin first
/plugin install skill-tools

# In Claude Code, ask:
# "Create a new skill for TypeScript type checking"
# The skill-creator will guide you through the process
```

**Option 2: Manual Creation**

```bash
# For a plugin skill (to be added to super-claude plugins)
mkdir -p plugins/typescript-tools/skills
cp configs/templates/SKILL_TEMPLATE.md plugins/typescript-tools/skills/my-skill.md

# For a project-specific skill
mkdir -p .claude/skills
cp ~/.claude/skills/super-claude/configs/templates/SKILL_TEMPLATE.md .claude/skills/my-skill.md

# Edit and test
vim <skill-path>
# (Open Claude Code in a project and try the skill)
```

## Skill Development Process

### 1. RED: Document Failures

Run scenarios **WITHOUT the skill** and document:

- Baseline behavior
- Agent rationalizations (verbatim)
- Specific failure modes

### 2. GREEN: Write Minimal Skill

Create minimal skill addressing those failures:

- Write YAML frontmatter
- Add core instructions
- Test that agents comply

### 3. REFACTOR: Plug Rationalizations

- Identify new rationalizations
- Add explicit counters
- Re-test until bulletproof

**Critical**: Never deploy untested skills!

## Skill Structure

### YAML Frontmatter (Required)

```yaml
---
name: skill-identifier # kebab-case, unique
version: 1.0.0 # Semantic versioning
description: |
  What it does + when to use + activation triggers.
  Be specific and searchable.
category: workflow-automation
tags: [typescript, testing]
model: sonnet # sonnet | haiku | opus
---
```

### Content Structure

```markdown
# Skill Name

## When to Use

- Concrete triggers and symptoms
- Small flowchart ONLY for non-obvious decisions

## Core Pattern / Quick Reference

- Before/after comparisons
- Scannable tables

## Implementation

- Inline code for simple patterns
- Link to API_REFERENCE.md for heavy reference

## Common Mistakes

- Specific failures + fixes for each
```

### Token Efficiency

**Targets:**

- Getting-started workflows: < 150 words
- Frequently-loaded skills: < 200 words
- Other skills: < 500 words (use progressive disclosure)

**Progressive Disclosure:**

1. **Metadata** (YAML) - Loaded at startup
2. **SKILL.md** (< 500 lines) - Core instructions
3. **API_REFERENCE.md** - Advanced topics (loaded on demand)

## Best Practices

### Search Optimization

Make skills discoverable:

- Rich `description` with error messages and symptoms
- Keyword repetition in frontmatter/overview/headers
- Symptom-based triggers (not language-specific)
- Multiple discovery touchpoints

### Anti-Patterns to Avoid

- ❌ Narrative examples tied to specific sessions
- ❌ Multi-language dilution (one excellent example > five mediocre)
- ❌ Generic labels (helper1, step2)
- ❌ Code embedded in flowcharts
- ❌ Flowcharts for linear instructions

### Validation Patterns

Include validation at multiple levels:

- Parameter validation (user inputs)
- Data validation (API responses)
- Temporal validation (dates, sequences)
- Completeness validation (all expected data present)

## Universal Executor Pattern

For skills that generate and execute code dynamically:

```javascript
// run.js - Universal executor for dynamic code
export async function execute(code, context) {
  // 1. Create temp file with proper module context
  // 2. Set up environment with dependencies
  // 3. Execute with proper module resolution
  // 4. Parse results
  // 5. Clean up without race conditions
}
```

**When to use:**

- Test framework integration (Vitest, Playwright)
- CLI validation and testing
- Dynamic code generation + execution

See [playwright-skill](https://github.com/lackeyjb/playwright-skill) for reference implementation.

## Testing Your Skill

### Manual Testing

1. Create skill in appropriate category
2. Open Claude Code in a relevant project
3. Trigger the skill through natural conversation
4. Verify Claude uses the skill appropriately
5. Check for rationalizations or failures

### Automated Testing

```bash
# Use subagent testing pattern
# 1. Create test scenarios
# 2. Run WITHOUT skill (document failures)
# 3. Run WITH skill (verify compliance)
# 4. Iterate until bulletproof
```

## Publishing

### To super-claude Plugins (Public)

1. Create skill in `plugins/<plugin-name>/skills/`
2. Update plugin's plugin.json manifest to list the skill
3. Test thoroughly in multiple projects
4. Update README.md with skill description
5. Commit and push
6. Tag release if significant

### Project-Specific Skills

1. Create skill in `<project>/.claude/skills/`
2. Keep in project's version control if team-shared
3. Or keep in global `~/.claude/skills/` for personal use
4. Test within the specific project context

## Examples

See existing skills for reference:

- **Meta-tools**: `skill-tools/skill-creator` - Creates new skills
- **Simple workflow**: Future `git-tools/smart-commit`
- **Complex**: Future `testing-tools/vitest-integration` - Universal executor pattern
- **Advanced**: Future `typescript-tools/tsc-files-validation` - Multi-scenario validation

## Resources

- [obra/superpowers-skills](https://github.com/obra/superpowers-skills) - Community collection
- [anthropics/skills](https://github.com/anthropics/skills) - Official examples
- [playwright-skill](https://github.com/lackeyjb/playwright-skill) - Universal executor pattern
- [Best Practices](./BEST_PRACTICES.md) - Comprehensive patterns guide

---

**Remember:** Skills are most effective when they address specific, repeatable problems and are tested before deployment!
