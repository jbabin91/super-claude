# Skill Auto-Activation Guide

Complete guide to the Claude Code skill auto-activation system for super-claude.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Plugin-Level Rules](#plugin-level-rules)
- [Project-Level Overrides](#project-level-overrides)
- [Matching Algorithms](#matching-algorithms)
- [Configuration Options](#configuration-options)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Migration from YAML](#migration-from-yaml)
- [FAQ](#faq)

## Overview

The skill auto-activation system automatically suggests relevant skills when you submit prompts to Claude Code. Instead of manually invoking skills, the system:

- Analyzes your prompt for keywords and intent patterns
- Discovers activation rules from all installed plugins
- Merges plugin rules with your project-specific overrides
- Suggests the most relevant skills before Claude responds

**Benefits:**

- ✅ Zero configuration - works with plugin defaults
- ✅ Consistent skill activation - no more forgotten skills
- ✅ Customizable per project - override priorities and triggers
- ✅ Fast execution - <50ms overhead
- ✅ Clean plugin management - each plugin defines its own rules

## Quick Start

### For Users

**1. Install a plugin with auto-activation support:**

```bash
/plugin install claude-tools
```txt

**2. Skills activate automatically:**

```txt
You: "I want to create a new skill for testing"

[RECOMMENDED] SKILLS:
  -> skill-creator

ACTION: Use Skill tool BEFORE responding
```txt

**3. (Optional) Customize for your project:**

```bash
/configure-activation
```txt

Edit `.claude/skills/skill-rules.json` to customize triggers, priorities, or disable skills.

### For Plugin Authors

**1. Create `skill-rules.json` in your plugin:**

```json
{
  "plugin": {
    "name": "your-plugin",
    "version": "1.0.0",
    "namespace": "yourns"
  },
  "skills": {
    "your-skill": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["keyword1", "keyword2"],
        "intentPatterns": ["pattern1", "pattern2"]
      }
    }
  }
}
```txt

**2. Place in your plugin:**

```txt
plugins/your-plugin/
└── skills/
    └── skill-rules.json
```txt

**3. Users get auto-activation when they install your plugin!**

## How It Works

### Architecture

```txt
User Prompt
    ↓
UserPromptSubmit Hook (skill-activation-prompt.ts)
    ↓
1. Discover skill-rules.json files from .claude/skills/*/
2. Load project overrides from .claude/skills/skill-rules.json
3. Merge rules (project > plugin precedence)
4. Match prompt against keywords + patterns
5. Format and output suggestions
    ↓
Claude sees augmented context with skill suggestions
```txt

### File Organization

**Installed plugins (after /plugin install):**

```txt
.claude/skills/
├── claude-tools/
│   ├── skill-rules.json       # From plugin
│   └── skills/...
├── tanstack-tools/
│   ├── skill-rules.json       # From another plugin
│   └── skills/...
└── skill-rules.json           # Your project overrides (optional)
```txt

**Hook location:**

```txt
.claude/hooks/
└── skill-activation-prompt.ts  # Installed with claude-tools
```txt

## Plugin-Level Rules

Plugin authors define activation rules for their skills in `skill-rules.json`.

### Schema

```typescript
interface PluginSkillRules {
  plugin: {
    name: string; // Plugin name
    version: string; // Semantic version
    namespace: string; // Prevents conflicts (e.g., "claude")
  };
  skills: Record<string, SkillConfig>;
}

interface SkillConfig {
  type: 'domain' | 'guardrail';
  enforcement: 'suggest' | 'block' | 'warn'; // MVP: only 'suggest'
  priority: 'critical' | 'high' | 'medium' | 'low';
  description?: string;
  promptTriggers: {
    keywords?: string[]; // Literal matches
    intentPatterns?: string[]; // Regex patterns
  };
}
```txt

### Example: claude-tools

```json
{
  "plugin": {
    "name": "claude-tools",
    "version": "1.0.0",
    "namespace": "claude"
  },
  "skills": {
    "skill-creator": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "description": "Generate new Claude Code skills with proper structure",
      "promptTriggers": {
        "keywords": ["create skill", "new skill", "skill development"],
        "intentPatterns": [
          "(create|add|generate).*?skill",
          "how to.*?(create|add).*?skill"
        ]
      }
    },
    "hook-creator": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "description": "Generate Claude Code hooks for workflow automation",
      "promptTriggers": {
        "keywords": ["create hook", "pre-commit", "post-commit"],
        "intentPatterns": [
          "(create|add).*?hook",
          "(pre|post)[-\\s](commit|push)"
        ]
      }
    }
  }
}
```txt

## Project-Level Overrides

Customize plugin rules for your specific project in `.claude/skills/skill-rules.json`.

### Schema

```typescript
interface ProjectSkillRules {
  version: string;
  overrides: Record<string, Partial<SkillConfig>>; // Namespace required
  disabled: string[]; // Skills to skip
  global?: {
    maxSkillsPerPrompt?: number;
    priorityThreshold?: 'critical' | 'high' | 'medium' | 'low';
  };
}
```txt

### Generate Template

```bash
/configure-activation
```txt

Creates `.claude/skills/skill-rules.json` with clean template.

### Example Overrides

**1. Increase skill priority:**

```json
{
  "version": "1.0",
  "overrides": {
    "claude/skill-creator": {
      "priority": "critical"
    }
  },
  "disabled": [],
  "global": {}
}
```txt

**2. Add project-specific keywords:**

```json
{
  "version": "1.0",
  "overrides": {
    "hono/api-builder": {
      "promptTriggers": {
        "keywords": ["create endpoint", "new route", "api endpoint", "REST API"]
      }
    }
  },
  "disabled": [],
  "global": {}
}
```txt

**3. Disable unwanted skills:**

```json
{
  "version": "1.0",
  "overrides": {},
  "disabled": ["claude/old-skill", "tanstack/deprecated-helper"],
  "global": {}
}
```txt

**4. Limit suggestions:**

```json
{
  "version": "1.0",
  "overrides": {},
  "disabled": [],
  "global": {
    "maxSkillsPerPrompt": 3,
    "priorityThreshold": "high"
  }
}
```txt

### Merge Strategy (MVP)

**Shallow merge** - entire nested objects are replaced:

```json
// Plugin default
{
  "promptTriggers": {
    "keywords": ["create skill"],
    "intentPatterns": ["(create|add).*?skill"]
  }
}

// Your override
{
  "promptTriggers": {
    "keywords": ["create skill", "scaffold skill"]
  }
}

// Result: intentPatterns are LOST (not merged)
{
  "promptTriggers": {
    "keywords": ["create skill", "scaffold skill"]
  }
}
```txt

**Workaround:** Copy the entire object from plugin and modify it.

## Matching Algorithms

### Keyword Matching (Literal)

Case-insensitive literal string matching:

```typescript
function matchKeywords(prompt: string, keywords: string[]): boolean {
  const normalizedPrompt = prompt.toLowerCase();
  return keywords.some((kw) => normalizedPrompt.includes(kw.toLowerCase()));
}
```txt

**Example:**

- Prompt: "I want to create a new skill for testing"
- Keywords: `["create skill", "skill development"]`
- Match: ✅ (contains "create" + "skill")

**Tips:**

- Use 2-4 most common phrases
- Keep keywords specific but not too narrow
- Test with real user prompts

### Intent Pattern Matching (Regex)

Regex patterns with case-insensitive flag:

```typescript
function matchIntent(prompt: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(prompt);
  });
}
```txt

**Example:**

- Prompt: "How do I add a new hook for pre-commit?"
- Pattern: `"(create|add).*?hook"`
- Match: ✅ (matches "add ... hook")

**Tips:**

- Use 1-3 patterns per skill
- Capture intent variations with OR groups: `(create|add|generate)`
- Use `.*?` (non-greedy) between terms
- Test patterns at [regex101.com](https://regex101.com)

**Common Patterns:**

```regex
(create|add|generate).*?skill          # Creation intent
how to.*?(create|add).*?skill          # Question format
(pre|post)[-\s](commit|push)           # Git hooks
(fix|solve|debug).*?(error|bug)        # Debugging
(setup|configure|install).*?auth       # Configuration
```txt

## Configuration Options

### Priority Levels

| Priority   | Icon            | Usage                              | Example                      |
| ---------- | --------------- | ---------------------------------- | ---------------------------- |
| `critical` | `[CRITICAL]`    | Must-use skills essential for task | Security guardrails (future) |
| `high`     | `[RECOMMENDED]` | Strongly recommended skills        | skill-creator, hook-creator  |
| `medium`   | `[OPTIONAL]`    | Moderately useful skills           | skill-validator              |
| `low`      | `[SUGGESTED]`   | Optional helper skills             | Documentation generators     |

**Sorting:** Skills are sorted by priority (critical first, low last).

### Enforcement Types (MVP: suggest only)

| Type      | Status    | Behavior                       |
| --------- | --------- | ------------------------------ |
| `suggest` | ✅ MVP    | Show skill as recommendation   |
| `block`   | 🔮 Future | Block action until skill used  |
| `warn`    | 🔮 Future | Show warning if skill not used |

### Skill Types

| Type        | Usage                               |
| ----------- | ----------------------------------- |
| `domain`    | Domain-specific development skills  |
| `guardrail` | Safety/quality enforcement (future) |

### Global Settings

**maxSkillsPerPrompt:**

- Limits number of suggestions shown
- Default: `null` (unlimited)
- Example: `3` → only top 3 skills by priority

**priorityThreshold:**

- Minimum priority to show
- Options: `'critical' | 'high' | 'medium' | 'low' | null`
- Example: `'high'` → only critical and high-priority skills

## Best Practices

### For Plugin Authors

**1. Choose good keywords:**

```json
// ✅ Good: Specific but not too narrow
"keywords": ["create skill", "new skill", "skill development"]

// ❌ Bad: Too broad
"keywords": ["create", "new", "development"]

// ❌ Bad: Too narrow
"keywords": ["create a new skill with proper YAML frontmatter"]
```txt

**2. Design intent patterns:**

```json
// ✅ Good: Captures variations
"intentPatterns": [
  "(create|add|generate).*?skill",
  "how to.*?(create|add).*?skill"
]

// ❌ Bad: Too specific
"intentPatterns": ["create skill"]

// ❌ Bad: Matches everything
"intentPatterns": [".*skill.*"]
```txt

**3. Test with real prompts:**

```bash
# Test your patterns
echo '{"cwd":".","prompt":"I want to create a skill"}' | \
  bun run plugins/claude-tools/hooks/skill-activation-prompt.ts
```txt

**4. Balance precision and recall:**

- **Precision:** Avoid false positives (irrelevant matches)
- **Recall:** Catch all relevant prompts

**5. Use appropriate priorities:**

- `critical`: Security, correctness (future guardrails)
- `high`: Core workflow skills users rely on
- `medium`: Helper skills that improve quality
- `low`: Nice-to-have utilities

### For Users

**1. Start with defaults:**

Don't create overrides until you need them. Plugin defaults work well!

**2. Add project-specific keywords:**

```json
{
  "overrides": {
    "hono/api-builder": {
      "promptTriggers": {
        "keywords": [
          "create endpoint",
          "new route",
          "api endpoint",
          "backend route",
          "REST API"
        ]
      }
    }
  }
}
```txt

**3. Disable unused skills:**

```json
{
  "disabled": [
    "claude/skill-creator", // Not creating skills in this project
    "tanstack/deprecated-helper"
  ]
}
```txt

**4. Limit noise in large projects:**

```json
{
  "global": {
    "maxSkillsPerPrompt": 2,
    "priorityThreshold": "high"
  }
}
```txt

## Troubleshooting

### Hook Not Running

**Symptom:** No skill suggestions appear

**Checks:**

1. **Is Bun installed?**

   ```bash
   bun --version
   ```

   Install: <https://bun.sh>

2. **Is hook in correct location?**

   ```bash
   ls -la .claude/hooks/skill-activation-prompt.ts
   ```

3. **Is hook executable?**

   ```bash
   chmod +x .claude/hooks/skill-activation-prompt.ts
   ```

4. **Check hook input:**

   ```bash
   echo '{"cwd":".","prompt":"test"}' | \
     bun run .claude/hooks/skill-activation-prompt.ts
   ```

### Skills Not Activating

**Symptom:** Expected skill doesn't appear in suggestions

**Checks:**

1. **Does plugin have skill-rules.json?**

   ```bash
   cat .claude/skills/claude-tools/skill-rules.json
   ```

2. **Do keywords match your prompt?**
   - Try exact keywords: "create skill"
   - Check case-insensitive matching works

3. **Is skill disabled in overrides?**

   ```bash
   cat .claude/skills/skill-rules.json | grep disabled
   ```

4. **Check priority threshold:**

   ```json
   {
     "global": {
       "priorityThreshold": "high" // Blocks medium/low
     }
   }
   ```

### Performance Issues

**Symptom:** Hook takes >50ms

**Solutions:**

1. **Reduce number of skills:**
   - Disable unused skills in project overrides

2. **Simplify patterns:**
   - Avoid complex regex with backtracking
   - Use `.*?` (non-greedy) instead of `.*` (greedy)

3. **Limit suggestions:**

   ```json
   {
     "global": {
       "maxSkillsPerPrompt": 3
     }
   }
   ```txt

4. **Check warnings:**

   ```txt
   [WARNING]  Slow hook execution: 65ms
   ```txt

### Invalid JSON

**Symptom:** Hook warns about invalid skill-rules.json

**Solution:**

Validate JSON:

```bash
cat .claude/skills/claude-tools/skill-rules.json | jq .
```txt

Common issues:

- Trailing commas
- Missing quotes
- Unclosed brackets
- Comment syntax (JSON doesn't support `//`)

## Migration from YAML

### Old Format (YAML Frontmatter)

```yaml
---
name: skill-creator
triggers:
  keywords: [create skill, skill development]
  patterns: ['(create|add).*?skill']
---
```txt

### New Format (skill-rules.json)

```json
{
  "plugin": {
    "name": "claude-tools",
    "version": "1.0.0",
    "namespace": "claude"
  },
  "skills": {
    "skill-creator": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["create skill", "skill development"],
        "intentPatterns": ["(create|add).*?skill"]
      }
    }
  }
}
```txt

### Migration Command (Future)

```bash
/generate-skill-rules
```txt

Will parse YAML frontmatter and generate skill-rules.json entries.

## FAQ

### Q: Do I need to create project overrides?

**A:** No! Plugin defaults work well. Only create overrides if you need to customize for your specific project.

### Q: Can I have multiple plugins with same skill name?

**A:** Yes! Namespaces prevent conflicts. Skills are referenced as `namespace/skill-name`:

- `claude/skill-creator`
- `tanstack/skill-creator`

### Q: What happens if no skills match?

**A:** Hook outputs nothing and exits cleanly. No error, no delay.

### Q: Can I disable auto-activation entirely?

**A:** Yes, remove the hook:

```bash
rm .claude/hooks/skill-activation-prompt.ts
```txt

### Q: How do I test my activation rules?

**A:** Use the hook directly:

```bash
echo '{"cwd":".","prompt":"your test prompt"}' | \
  bun run .claude/hooks/skill-activation-prompt.ts
```txt

### Q: Can I use environment variables in patterns?

**A:** Not in MVP. Patterns are static JSON strings.

### Q: What if I want deep merge instead of shallow?

**A:** Deep merge is planned for future versions. For now, copy the entire object from plugin defaults and modify it.

### Q: Can plugins see my project overrides?

**A:** No. Project overrides are local to your project and never shared with plugins.

### Q: How do I contribute patterns to a plugin?

**A:** Open a PR to the plugin repository with improved keywords/patterns. Test thoroughly!

### Q: Can I use file-based triggers?

**A:** Not in MVP. File-based triggers (activate based on edited files) are planned for future.

### Q: What's the performance impact?

**A:** Target is <50ms for typical projects (<10 plugins). Measured on each execution with warnings if exceeded.

### Q: Can I see which trigger matched?

**A:** Yes! The hook tracks `matchedBy` field internally. Add logging if needed for debugging.

## Resources

- **OpenSpec Proposal:** `openspec/changes/add-skill-auto-activation/`
- **Template Files:**
  - Plugin: `plugins/claude-tools/templates/skill-rules.template.json`
  - Project: `plugins/claude-tools/templates/project-overrides.template.json`
- **Type Definitions:** `plugins/claude-tools/types/skill-rules.d.ts`
- **Hook Implementation:** `plugins/claude-tools/hooks/skill-activation-prompt.ts`
- **CLAUDE.md:** Auto-Activation System section

## Support

Issues? Questions? Suggestions?

- GitHub Issues: <https://github.com/jbabin91/super-claude/issues>
- Discussion: Tag issues with `auto-activation` label
- Contributing: See CONTRIBUTING.md (coming soon)

---

**Version:** 1.0.0
**Last Updated:** 2025-11-02
**Status:** ✅ Ready for production
