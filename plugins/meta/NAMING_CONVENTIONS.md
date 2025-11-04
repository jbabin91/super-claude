# Naming Conventions for Claude Code Enhancements

This guide defines the naming conventions for creating plugins, skills, agents, commands, and hooks in the super-claude project and any new plugins you create.

## Quick Reference

| Type        | Format                                    | Location                                    | Examples                                      |
| ----------- | ----------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| **Plugin**  | `{category}` or `{category}-{purpose}`    | `plugins/{name}/`                           | `tanstack`, `api`, `claude-tools`             |
| **Skill**   | `{name}.md` (NO `-skill` suffix)          | `plugins/{plugin}/skills/{name}/SKILL.md`   | `hono.md`, `component-generator.md`           |
| **Agent**   | `{name}-agent.md` (WITH `-agent` suffix)  | `plugins/{plugin}/agents/{name}-agent.md`   | `hono-agent.md`, `api-agent.md`               |
| **Command** | `{verb-phrase}.md` (NO `-command` suffix) | `plugins/{plugin}/commands/{name}.md`       | `create-hono-api.md`, `setup-auth.md`         |
| **Command** | `{namespace}/{command}.md` (namespaced)   | `.claude/commands/{namespace}/{command}.md` | `openspec/proposal.md` → `/openspec:proposal` |
| **Hook**    | `{event-name}.md` (NO `-hook` suffix)     | `plugins/{plugin}/hooks/{name}.md`          | `pre-commit.md`, `post-deploy.md`             |

## Detailed Guidelines

### Plugins

**Format:** `{category}` or `{category}-{purpose}` (no `-tools` suffix except for claude-tools)

**Examples:**

- ✅ `tanstack` (not `tanstack-tools`)
- ✅ `api` (not `api-tools`)
- ✅ `database` (not `database-tools`)
- ✅ `claude-tools` (special case: meta-tools for creating other enhancements)

**Rationale:** Simple, descriptive names without redundant suffixes. The `-tools` suffix was removed to avoid verbosity.

**Directory Structure:**

```txt
plugins/
├── tanstack/
│   ├── plugin.json
│   ├── README.md
│   ├── skills/
│   ├── agents/
│   ├── commands/
│   └── hooks/
└── api/
    ├── plugin.json
    ├── README.md
    ├── skills/
    ├── agents/
    ├── commands/
    └── hooks/
```

### Skills

**Format:** Descriptive kebab-case name (NO `-skill` suffix)

**Location:** `plugins/{plugin}/skills/{name}/SKILL.md`

**Examples:**

- ✅ `hono.md` (not `hono-skill.md`)
- ✅ `api.md` (not `api-skill.md`)
- ✅ `component-generator.md` (not `component-generator-skill.md`)
- ✅ `drizzle-maestro.md` (not `drizzle-maestro-skill.md`)

**Rationale:** The `skills/` directory already indicates the type, so the `-skill` suffix is redundant and verbose.

**When to separate vs combine:**

- **Separate skills:** When different tools/frameworks have distinct APIs and patterns
  - Example: `hono.md` vs `elysia.md` (different frameworks, different patterns)
- **Combined skill:** When providing general guidance that applies across tools
  - Example: `api.md` (general API patterns that work with any framework)

**File Structure:**

```txt
plugins/api/skills/
├── hono/
│   └── SKILL.md
├── elysia/
│   └── SKILL.md
└── api/
    └── SKILL.md
```

### Agents

**Format:** `{name}-agent.md` (WITH `-agent` suffix)

**Location:** `plugins/{plugin}/agents/{name}-agent.md`

**Examples:**

- ✅ `hono-agent.md`
- ✅ `api-agent.md`
- ✅ `component-agent.md`
- ✅ `drizzle-agent.md`

**Rationale:** The `-agent` suffix helps distinguish agents from skills with similar names. For example:

- `skills/hono/SKILL.md` - Provides guidance for Hono development
- `agents/hono-agent.md` - Autonomous agent that generates Hono APIs

**When to create an agent:**

- Complex, multi-step workflows that benefit from autonomy
- Tasks that require decision-making and exploration
- Operations that involve multiple tools and services

**File Structure:**

```txt
plugins/api/agents/
├── hono-agent.md
├── api-agent.md
└── openapi-agent.md
```

### Commands

**Format:** Verb phrases in kebab-case (NO `-command` suffix)

**Location:** `plugins/{plugin}/commands/{name}.md` or `.claude/commands/{namespace}/{name}.md`

**Examples:**

- ✅ `create-hono-api.md` (not `create-hono-api-command.md`)
- ✅ `generate-component.md` (not `generate-component-command.md`)
- ✅ `setup-auth.md` (not `setup-auth-command.md`)
- ✅ `run-migrations.md` (not `run-migrations-command.md`)

**Namespaced commands (OpenSpec pattern):**

- ✅ `.claude/commands/openspec/proposal.md` - `/openspec:proposal`
- ✅ `.claude/commands/openspec/apply.md` - `/openspec:apply`
- ✅ `.claude/commands/openspec/archive.md` - `/openspec:archive`

**Rationale:** The `commands/` directory already indicates the type. Commands should start with action verbs (create, generate, setup, run, build, deploy, etc.). Namespacing with `{namespace}/{command}.md` allows grouping related commands under a common prefix.

**Command naming best practices:**

- Start with a verb: `create-`, `generate-`, `setup-`, `run-`, `build-`, `deploy-`
- Be specific: `create-hono-api` instead of just `create-api`
- Use kebab-case: `setup-auth-provider` not `setupAuthProvider`
- For related commands, use namespacing: `{namespace}/{command}.md` → `/namespace:command`

**File Structure:**

```txt
plugins/api/commands/
├── create-hono-api.md
├── setup-openapi.md
└── generate-types.md

# Or with namespacing (OpenSpec pattern):
.claude/commands/
└── openspec/
    ├── proposal.md     # /openspec:proposal
    ├── apply.md        # /openspec:apply
    └── archive.md      # /openspec:archive
```

### Hooks

**Format:** Event-based or lifecycle names (NO `-hook` suffix)

**Location:** `plugins/{plugin}/hooks/{name}.md`

**Examples:**

- ✅ `pre-commit.md` (not `pre-commit-hook.md`)
- ✅ `post-deploy.md` (not `post-deploy-hook.md`)
- ✅ `on-error.md` (not `on-error-hook.md`)
- ✅ `before-build.md` (not `before-build-hook.md`)

**Rationale:** The `hooks/` directory already indicates the type. Hook names should clearly indicate when they trigger.

**Hook naming patterns:**

- **Lifecycle events:** `pre-commit`, `post-commit`, `pre-push`, `post-deploy`
- **Event-based:** `on-error`, `on-success`, `on-test-fail`
- **Temporal:** `before-build`, `after-build`, `during-test`

**File Structure:**

```txt
plugins/git/hooks/
├── pre-commit.md
├── post-commit.md
└── pre-push.md
```

## Anti-Patterns to Avoid

### ❌ Redundant Suffixes

**Wrong:**

```txt
plugins/api/skills/hono-skill.md     # Redundant -skill suffix
plugins/api/commands/create-command.md  # Redundant -command suffix
plugins/git/hooks/pre-commit-hook.md   # Redundant -hook suffix
```

**Right:**

```txt
plugins/api/skills/hono.md
plugins/api/commands/create.md
plugins/git/hooks/pre-commit.md
```

### ❌ Generic Names

**Wrong:**

```txt
plugins/tools/              # Too generic, what kind of tools?
plugins/helpers/            # What do they help with?
plugins/utils/              # Avoid "utils" in names
```

**Right:**

```txt
plugins/api/                # Specific: API development tools
plugins/testing/            # Specific: Testing automation
plugins/claude-tools/       # Specific: Meta-tools for creating skills
```

### ❌ Vague Skill Names

**Wrong:**

```txt
skills/helper1.md           # What does it help with?
skills/tool.md              # Too generic
skills/util.md              # Not descriptive
```

**Right:**

```txt
skills/component-generator.md     # Clear purpose
skills/drizzle-maestro.md        # Descriptive and memorable
skills/hono.md                   # Framework-specific
```

### ❌ Inconsistent Casing

**Wrong:**

```txt
skills/honoAPI.md           # camelCase
skills/HONO_API.md          # SCREAMING_SNAKE_CASE
skills/Hono_Api.md          # Mixed case
```

**Right:**

```txt
skills/hono-api.md          # kebab-case
skills/component-generator.md
skills/drizzle-maestro.md
```

## Examples from super-claude

### TanStack Plugin

```txt
plugins/tanstack/
├── plugin.json
├── README.md
├── skills/
│   ├── tanstack-start-wizard/
│   │   └── SKILL.md
│   ├── tanstack-query-helper/
│   │   └── SKILL.md
│   ├── tanstack-router-helper/
│   │   └── SKILL.md
│   ├── tanstack-form-helper/
│   │   └── SKILL.md
│   └── tanstack-table-helper/
│       └── SKILL.md
└── commands/
    ├── create-start-app.md
    └── setup-router.md
```

### API Plugin

```txt
plugins/api/
├── plugin.json
├── README.md
├── skills/
│   ├── hono/
│   │   └── SKILL.md
│   ├── elysia/
│   │   └── SKILL.md
│   └── api/
│       └── SKILL.md
├── agents/
│   ├── hono-agent.md
│   ├── elysia-agent.md
│   └── api-agent.md
└── commands/
    ├── create-hono-api.md
    ├── create-elysia-api.md
    └── setup-openapi.md
```

### Database Plugin

```txt
plugins/database/
├── plugin.json
├── README.md
├── skills/
│   └── drizzle-maestro/
│       └── SKILL.md
├── agents/
│   └── drizzle-agent.md
└── commands/
    ├── generate-schema.md
    ├── create-migration.md
    └── run-migrations.md
```

### Git Plugin

```txt
plugins/git/
├── plugin.json
├── README.md
├── skills/
│   ├── smart-commit/
│   │   └── SKILL.md
│   ├── pr-description/
│   │   └── SKILL.md
│   └── changelog-generator/
│       └── SKILL.md
├── hooks/
│   ├── pre-commit.md
│   ├── post-commit.md
│   └── pre-push.md
└── commands/
    ├── create-commit.md
    ├── generate-pr.md
    └── update-changelog.md
```

### Project Commands (Namespaced Pattern)

For project-specific or workflow commands, use the `.claude/commands/{namespace}/` pattern:

```txt
.claude/commands/
├── openspec/
│   ├── proposal.md      # /openspec:proposal - Create OpenSpec proposal
│   ├── apply.md         # /openspec:apply - Implement approved change
│   └── archive.md       # /openspec:archive - Archive deployed change
├── tanstack/
│   ├── new-app.md       # /tanstack:new-app - Create TanStack Start app
│   └── add-query.md     # /tanstack:add-query - Add TanStack Query
└── api/
    ├── new-endpoint.md  # /api:new-endpoint - Create API endpoint
    └── generate-docs.md # /api:generate-docs - Generate OpenAPI docs
```

**When to use namespaced commands:**

- **Project-specific workflows** - Commands that apply to your specific project
- **Grouped operations** - Related commands that share a common prefix
- **Third-party integrations** - Commands for external tools (like OpenSpec)

**Command invocation:**

```bash
# Flat structure (plugin commands)
/create-commit

# Namespaced structure (project commands)
/openspec:proposal
/openspec:apply
/tanstack:new-app
```

## When to Break Conventions

These naming conventions should be followed **99% of the time**. The only exceptions are:

1. **claude-tools plugin** - Keeps the `-tools` suffix because it's meta-tools for creating other enhancements
2. **Legacy compatibility** - If migrating from an existing plugin ecosystem with established names
3. **Brand names** - If a tool/framework has a specific branding (e.g., TanStack is capitalized in prose but lowercase in file names)

If you think you need to break a convention, document WHY in the plugin's README.md.

## Checklist for New Plugins

When creating a new plugin, ensure:

- [ ] Plugin name is kebab-case without `-tools` suffix (unless it's claude-tools)
- [ ] Skills are in `skills/{name}/SKILL.md` without `-skill` suffix
- [ ] Agents are in `agents/{name}-agent.md` with `-agent` suffix
- [ ] Commands are in `commands/{name}.md` with verb phrases, no `-command` suffix
- [ ] Hooks are in `hooks/{name}.md` with lifecycle/event names, no `-hook` suffix
- [ ] All file names use kebab-case consistently
- [ ] No generic names like `helper`, `util`, or `tool`
- [ ] Names are descriptive and self-documenting

## References

- **CLAUDE.md** - Project-level naming conventions
- **openspec/project.md** - OpenSpec naming conventions
- **plugins/claude-tools/** - Meta-tools for creating plugins with correct naming
