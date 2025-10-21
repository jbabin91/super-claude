---
name: skill-validator
version: 1.0.0
description: |
  Validate Claude Code skills, commands, agents, hooks, and plugins against Anthropic specifications.
  Checks structure, format, best practices, and common issues.
  Use before committing or distributing skills/plugins.
category: meta
tags: [validation, quality, meta, claude-code]
model: sonnet
triggers:
  keywords: [validate skill, check skill, validate plugin, lint skill]
  patterns: ["validate.*(skill|plugin|command|agent|hook)", "check.*(skill|plugin)"]
---

# Skill Validator

Validate Claude Code components against specifications and best practices.

## When to Use

- Before committing skills/plugins
- Before distributing to marketplace
- During skill development (catch issues early)
- Reviewing community contributions
- Ensuring quality standards

## Validation Checks

### Skills (SKILL.md)

#### Structure Checks
- ✅ YAML frontmatter present and valid
- ✅ Required fields: name, version, description
- ✅ Name is kebab-case
- ✅ Version follows semantic versioning
- ✅ Description is clear and includes triggers

#### Content Checks
- ✅ Has "When to Use" section
- ✅ Has workflow or instructions
- ✅ Includes examples
- ✅ Under 500 lines (or has progressive disclosure)
- ✅ No TODOs or placeholders
- ✅ No generic labels (helper, util, tool)

#### Best Practices
- ✅ Specific triggers (not too generic)
- ✅ Real examples (not placeholders)
- ✅ Clear, actionable instructions
- ✅ Integration points documented
- ✅ Troubleshooting section present

### Commands

#### Structure Checks
- ✅ YAML frontmatter with description
- ✅ Clear command name
- ✅ Usage examples provided
- ✅ Parameters documented

#### Content Checks
- ✅ Purpose is clear
- ✅ Instructions are actionable
- ✅ Examples show real usage
- ✅ Parameter descriptions complete

### Agents

#### Structure Checks
- ✅ YAML frontmatter present
- ✅ Model specified (haiku/sonnet/opus)
- ✅ Purpose is clear
- ✅ Workflow defined

#### Content Checks
- ✅ Single responsibility
- ✅ Operational principles defined
- ✅ Quality standards specified
- ✅ Success criteria clear
- ✅ Appropriate model for task complexity

### Hooks

#### Structure Checks
- ✅ Valid JSON format
- ✅ Event type is valid
- ✅ Command is specified
- ✅ Description provided

#### Safety Checks
- ✅ No arbitrary code execution
- ✅ File paths are validated
- ✅ Commands are safe
- ✅ Filters are specific (not too broad)

### Plugins

#### Structure Checks
- ✅ `.claude-plugin/plugin.json` exists
- ✅ Valid JSON format
- ✅ Required fields present
- ✅ Referenced components exist
- ✅ Directory structure correct

#### Manifest Checks
- ✅ Name is kebab-case
- ✅ Version follows semver
- ✅ Description is clear
- ✅ Keywords are relevant
- ✅ Author info present (if distributing)

## Core Workflow

### 1. Identify Component Type

Determine what to validate:
- Skill (SKILL.md)
- Command (.md in commands/)
- Agent (.md in agents/)
- Hook (hooks.json)
- Plugin (entire plugin directory)

### 2. Run Validation Checks

Execute appropriate checks based on component type.

### 3. Report Issues

Categorize by severity:
- **Error**: Must fix (prevents functionality)
- **Warning**: Should fix (best practice violation)
- **Info**: Consider fixing (minor improvement)

### 4. Provide Fixes

For each issue, provide:
- Description of problem
- Why it's an issue
- How to fix it
- Code example if applicable

## Validation Examples

### Skill Validation

**Input:** `skills/my-skill.md`

**Checks:**
```
✅ YAML frontmatter valid
✅ Name: my-skill (kebab-case)
✅ Version: 1.0.0 (semver)
✅ Description present
⚠️  No triggers defined
⚠️  Missing "When to Use" section
✅ Has examples
✅ 342 lines (under 500)
❌ Contains TODO on line 45
❌ Uses generic label "helper" in title
```

**Report:**
```
Errors (2):
  1. Line 45: TODO found - remove before publishing
  2. Line 12: Generic label "helper" - be more specific

Warnings (2):
  1. No triggers defined - skill won't auto-activate
  2. Missing "When to Use" section - users won't know when to apply

Info (0):
  None

Score: 6/10 - Fix errors before publishing
```

### Plugin Validation

**Input:** `my-plugin/`

**Checks:**
```
✅ plugin.json exists
✅ Valid JSON
✅ Name: my-plugin
✅ Version: 1.0.0
⚠️  No description
❌ Referenced skill "skill-1" not found in skills/
✅ Directory structure correct
⚠️  No README.md
⚠️  No LICENSE file
```

**Report:**
```
Errors (1):
  1. plugin.json references "skill-1" but skills/skill-1.md doesn't exist

Warnings (3):
  1. plugin.json missing description field
  2. README.md not found - add documentation
  3. LICENSE file missing - add if distributing publicly

Info (0):
  None

Score: 5/10 - Fix errors, address warnings
```

## Validation Rules

### Severity Levels

**Error (Must Fix):**
- Invalid YAML/JSON syntax
- Missing required fields
- Referenced files don't exist
- TODOs in production code
- Security issues in hooks
- Invalid semantic version

**Warning (Should Fix):**
- Missing recommended fields
- No triggers (skill won't auto-activate)
- Missing documentation sections
- Generic/vague naming
- No examples
- No license (public distribution)

**Info (Consider):**
- Could improve clarity
- Additional documentation helpful
- Consider progressive disclosure (long skills)

### Common Issues

#### Generic Naming
```
❌ my-helper
❌ utils-tool
❌ component-stuff

✅ shadcn-component-generator
✅ drizzle-schema-generator
✅ tanstack-query-hook
```

#### Missing Triggers
```yaml
❌ Missing entirely

✅ triggers:
     keywords: [specific, technical, terms]
     patterns: ["regex.*patterns"]
```

#### TODOs in Production
```markdown
❌ ## Feature X
   TODO: Implement this later

✅ ## Feature X
   Complete implementation
```

#### Vague Descriptions
```
❌ "Helps with things"
❌ "Utility for stuff"

✅ "Generate type-safe API clients from OpenAPI schemas"
✅ "Validate React components for WCAG AAA accessibility"
```

## Validation Output Format

```
Component: [name]
Type: [skill|command|agent|hook|plugin]
Location: [file path]

Structure: [✅|⚠️|❌]
Content: [✅|⚠️|❌]
Best Practices: [✅|⚠️|❌]

Errors (must fix): [count]
  1. [description]
  2. [description]

Warnings (should fix): [count]
  1. [description]
  2. [description]

Info (consider): [count]
  1. [description]

Overall Score: [0-10]
Status: [Ready|Needs work|Not ready]

Recommendations:
  - [specific action 1]
  - [specific action 2]
```

## Validation Best Practices

1. **Validate Early**: Check during development, not just before publishing
2. **Fix Errors First**: Don't publish with errors
3. **Address Warnings**: They indicate best practice violations
4. **Review Info**: Consider suggestions for improvements
5. **Re-validate**: After fixes, validate again

## Integration

### With Hooks

Auto-validate before commits:
```json
{
  "name": "validate-before-commit",
  "event": "user-prompt-submit",
  "when": "before",
  "command": "claude-validate --skills",
  "filter": {
    "promptPattern": "commit"
  }
}
```

### With Commands

Create validation command:
```markdown
---
description: Validate all skills in current plugin
---

# Validate Skills

Run skill-validator on all SKILL.md files in current plugin.

## Usage
\`\`\`
/validate-skills
\`\`\`
```

### With CI/CD

Add to GitHub Actions:
```yaml
- name: Validate Skills
  run: claude-validate --all --strict
```

## References

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Anthropic Best Practices](https://docs.claude.com/en/docs/claude-code/best-practices)
- [super-claude CREATING_SKILLS.md](../../docs/CREATING_SKILLS.md)
