# Design: Skill Auto-Activation System

## Architecture Overview

The skill auto-activation system uses a **hook-based, multi-source aggregation** architecture where each plugin defines its own activation rules, and a runtime hook discovers and merges these rules before presenting suggestions to Claude.

```txt
┌─────────────────────────────────────────────────────────┐
│ User submits prompt                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   v
┌─────────────────────────────────────────────────────────┐
│ UserPromptSubmit Hook (skill-activation-prompt.ts)      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 1. Read stdin (session_id, prompt, cwd)            │ │
│ │ 2. Discover all skill-rules.json files             │ │
│ │ 3. Load project overrides (if exists)              │ │
│ │ 4. Merge rules (project > plugin precedence)       │ │
│ │ 5. Match prompt against keywords + patterns        │ │
│ │ 6. Format + output suggestions                     │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────────────┘
                   │
                   v
┌─────────────────────────────────────────────────────────┐
│ Claude receives augmented context:                      │
│                                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│ 🎯 SKILL ACTIVATION CHECK                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│                                                          │
│ 📚 RECOMMENDED SKILLS:                                  │
│   → skill-creator                                       │
│   → hook-creator                                        │
│                                                          │
│ ACTION: Use Skill tool BEFORE responding                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                │
│                                                          │
│ [Original user prompt]                                  │
└─────────────────────────────────────────────────────────┘
```

## File Organization

### Plugin-Level Rules

```txt
plugins/claude-tools/
├── skills/
│   ├── skill-rules.json          # Activation rules for this plugin
│   ├── skill-creator/
│   ├── hook-creator/
│   └── ...
└── hooks/
    └── skill-activation-prompt.ts # The aggregator hook
```

### User Project (After Installation)

```txt
user-project/.claude/
├── skills/
│   ├── skill-rules.json           # Project overrides (optional)
│   ├── claude-tools/
│   │   ├── skill-rules.json       # From plugin
│   │   └── skills/...
│   └── tanstack/
│       ├── skill-rules.json       # From another plugin
│       └── skills/...
└── hooks/
    └── skill-activation-prompt.ts # Installed with claude-tools
```

## Data Schemas

### Plugin-Level skill-rules.json

```typescript
interface PluginSkillRules {
  plugin: {
    name: string; // e.g., "claude-tools"
    version: string; // Semantic version
    namespace: string; // Prevents conflicts (e.g., "claude")
  };
  skills: Record<string, SkillConfig>;
}

interface SkillConfig {
  type: 'domain' | 'guardrail';
  enforcement: 'suggest' | 'block' | 'warn';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description?: string; // Optional human-readable description
  promptTriggers: {
    keywords?: string[]; // Literal matches (case-insensitive)
    intentPatterns?: string[]; // Regex patterns for intent
  };
  // Future: fileTriggers, blockMessage, skipConditions
}
```

### Project-Level Overrides

```typescript
interface ProjectSkillRules {
  version: string;
  overrides: Record<string, Partial<SkillConfig>>; // Namespace required
  disabled: string[]; // Skills to skip
  global?: {
    maxSkillsPerPrompt?: number; // Limit suggestions
    priorityThreshold?: 'critical' | 'high' | 'medium' | 'low';
  };
}
```

## Matching Algorithm

### 1. Keyword Matching (Literal)

```typescript
function matchKeywords(prompt: string, keywords: string[]): boolean {
  const normalizedPrompt = prompt.toLowerCase();
  return keywords.some((kw) => normalizedPrompt.includes(kw.toLowerCase()));
}
```

**Example:**

- Prompt: "I want to create a new skill for testing"
- Keywords: `["create skill", "skill development"]`
- Match: ✅ (contains "create" + "skill")

### 2. Intent Pattern Matching (Regex)

```typescript
function matchIntent(prompt: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const regex = new RegExp(pattern, 'i');
    return regex.test(prompt);
  });
}
```

**Example:**

- Prompt: "How do I add a new hook for pre-commit?"
- Pattern: `"(create|add).*?hook"`
- Match: ✅ (matches "add ... hook")

### 3. Priority-Based Sorting

```typescript
const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

function sortByPriority(skills: MatchedSkill[]): MatchedSkill[] {
  return skills.sort(
    (a, b) =>
      priorityOrder[a.config.priority] - priorityOrder[b.config.priority],
  );
}
```

## Merge Strategy

**Precedence: Project Overrides > Plugin Defaults**

```typescript
function mergeRules(
  pluginRules: PluginSkillRules[],
  projectOverrides: ProjectSkillRules,
): Map<string, SkillConfig> {
  const merged = new Map<string, SkillConfig>();

  // 1. Load all plugin rules
  for (const plugin of pluginRules) {
    for (const [skillName, config] of Object.entries(plugin.skills)) {
      const key = `${plugin.plugin.namespace}/${skillName}`;
      merged.set(key, config);
    }
  }

  // 2. Apply project overrides (shallow merge for MVP)
  for (const [key, override] of Object.entries(projectOverrides.overrides)) {
    if (merged.has(key)) {
      merged.set(key, { ...merged.get(key)!, ...override });
    }
  }

  // 3. Remove disabled skills
  for (const disabledKey of projectOverrides.disabled) {
    merged.delete(disabledKey);
  }

  return merged;
}
```

**MVP Simplification:** Use shallow merge (object spread) instead of deep merge to avoid complexity.

## Hook Execution Flow

### Input (stdin)

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript",
  "cwd": "/Users/user/project",
  "permission_mode": "standard",
  "prompt": "I want to create a new skill"
}
```

### Processing Steps

1. **Parse stdin** → Extract prompt text
2. **Discover rules** → Find all `.claude/skills/*/skill-rules.json`
3. **Load overrides** → Check for `.claude/skills/skill-rules.json`
4. **Merge rules** → Apply precedence
5. **Match prompt** → Run keyword + pattern matching
6. **Filter** → Apply disabled list, priority threshold
7. **Sort** → Order by priority
8. **Limit** → Respect maxSkillsPerPrompt
9. **Format output** → Generate suggestion message

### Output (stdout)

```txt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RECOMMENDED SKILLS:
  → skill-creator
  → hook-creator

ACTION: Use Skill tool BEFORE responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Error Handling

```typescript
try {
  // Hook logic
} catch (error) {
  if (error.message.includes('Bun not found')) {
    console.error('⚠️  Bun required for skill activation');
    console.error('Install: https://bun.sh');
  } else {
    console.error('Hook error:', error.message);
  }
  process.exit(1); // Fail gracefully
}
```

## Auto-Migration from YAML

### Current YAML Format

```yaml
---
name: skill-creator
triggers:
  keywords: [create skill, skill development]
  patterns: ['(create|add).*?skill']
---
```

### Migration Process

```typescript
function migrateYAMLtoJSON(skillDir: string): SkillConfig {
  const skillMd = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf-8');
  const frontmatter = parseYAMLFrontmatter(skillMd);

  return {
    type: 'domain',
    enforcement: 'suggest',
    priority: 'high',
    promptTriggers: {
      keywords: frontmatter.triggers?.keywords || [],
      intentPatterns: frontmatter.triggers?.patterns || [],
    },
  };
}
```

**Trigger:** `/generate-skill-rules` command (internal use during MVP setup)

## Performance Considerations

### Target: <50ms per prompt

**Optimizations:**

1. **Cache plugin discovery** - Only scan directories on first run
2. **Lazy JSON parsing** - Parse files only when rules file exists
3. **Early exit** - Stop matching after `maxSkillsPerPrompt` reached
4. **Efficient regex** - Pre-compile patterns at load time

**Benchmarking:**

```typescript
const startTime = Date.now();
// Hook logic
const duration = Date.now() - startTime;
if (duration > 50) {
  console.warn(`Slow hook execution: ${duration}ms`);
}
```

## Future Enhancements (Not MVP)

### File-Based Triggers

```json
{
  "skill-creator": {
    "fileTriggers": {
      "pathPatterns": ["plugins/*/skills/*/SKILL.md"],
      "contentPatterns": ["---\\nname:", "triggers:"]
    }
  }
}
```

### Guardrail Skills (Blocking)

```json
{
  "frontend-guidelines": {
    "enforcement": "block",
    "blockMessage": "⚠️ Use Skill tool: 'frontend-guidelines' first"
  }
}
```

### Skill Dependencies

```json
{
  "drizzle-maestro": {
    "requires": ["backend-guidelines"],
    "suggestsWith": ["hono-api-builder"]
  }
}
```

## Trade-offs & Decisions

| Decision                   | Rationale                                                     |
| -------------------------- | ------------------------------------------------------------- |
| **Bun + TypeScript**       | Better maintainability than shell, less setup than Node + tsx |
| **Per-plugin rules**       | Clean install/uninstall, no merge conflicts                   |
| **Shallow merge (MVP)**    | Simpler implementation, covers 90% of use cases               |
| **Namespace required**     | Prevents conflicts when multiple plugins have same skill name |
| **No file triggers (MVP)** | Reduces complexity, can add later                             |
| **No blocking (MVP)**      | Suggestion-only is safer, blocking requires more testing      |

## Validation

Pre-commit validation with OpenSpec:

```bash
openspec validate add-skill-auto-activation --strict
```

Validates:

- Schema adherence
- No orphaned references
- Task completeness
- Scenario coverage
