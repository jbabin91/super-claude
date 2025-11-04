# Commit Conventions

Commit message format and conventions for the super-claude project.

## ⚠️ CRITICAL RULES

1. **Keep it SHORT** - Target 40-50 chars in subject, MAX 72
2. **ONE primary focus** - Main architectural change only, details go in body
3. **Analyze ONLY staged files** - Ignore unstaged/untracked completely
4. **ONE logical change** - Split commits if multiple unrelated changes
5. **Explain WHY not WHAT** - Purpose over implementation details

## Format

```txt
<type>(<scope>): <gitmoji> <description>

[optional body]

[optional footer]
```

**Example:**

```txt
docs: :memo: migrate to nested AGENTS.md pattern

- Add root AGENTS.md (main instructions)
- Add comprehensive docs/ structure
- Update CLAUDE.md to thin wrapper

Migrate from CLAUDE.md-centric to nested AGENTS.md pattern
for agent-agnostic instructions.
```

## Character Limit (STRICT)

**Subject line MUST be < 72 characters (count carefully!)**

**Character budget:**

- Type: 4-8 chars (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`)
- Scope: 0-15 chars (`(meta)`, `(design-system)`, or omit)
- Separator: 2 chars (`:`)
- Gitmoji: 7-13 chars (`:memo:`, `:sparkles:`, `:bug:`, `:recycle:`)
- **Description: 30-45 chars MAX**

**Target ranges:**

- 🎯 **40-50 chars:** Perfect! Concise and focused
- ✅ **51-65 chars:** Good, still readable
- 🟡 **66-72 chars:** Acceptable but getting long
- ❌ **73+ chars:** REJECTED - too long

## Types

| Type       | Use For                                 | Gitmoji              |
| ---------- | --------------------------------------- | -------------------- |
| `feat`     | New features, skills, capabilities      | `:sparkles:`         |
| `fix`      | Bug fixes                               | `:bug:`              |
| `docs`     | Documentation updates                   | `:memo:`             |
| `chore`    | Maintenance (dependencies, tooling)     | `:hammer:`           |
| `refactor` | Code restructuring (no behavior change) | `:recycle:`          |
| `test`     | Test additions/changes                  | `:white_check_mark:` |
| `style`    | Code formatting only (no logic changes) | `:art:`              |
| `perf`     | Performance improvements                | `:zap:`              |

## Scopes

Use plugin name or general category. **Omit scope when change affects entire project.**

**Plugin scopes:** `meta`, `design-system`, `testing`, `git`, `typescript`, `devops`

**General scopes:** `architecture`, `deps`, `openspec`

## Gitmoji Codes

**CRITICAL: Use gitmoji CODES (like `:memo:`), NOT literal emoji (like 📝)**

| Code                 | Emoji | Use For                |
| -------------------- | ----- | ---------------------- |
| `:sparkles:`         | ✨    | New features           |
| `:bug:`              | 🐛    | Bug fixes              |
| `:memo:`             | 📝    | Documentation          |
| `:recycle:`          | ♻️    | Refactoring            |
| `:hammer:`           | 🔨    | Scripts/tooling        |
| `:white_check_mark:` | ✅    | Tests                  |
| `:art:`              | 🎨    | Code formatting        |
| `:zap:`              | ⚡    | Performance            |
| `:fire:`             | 🔥    | Removing code          |
| `:arrow_up:`         | ⬆️    | Upgrading dependencies |
| `:wrench:`           | 🔧    | Configuration files    |
| `:bookmark:`         | 🔖    | Release/version tags   |

Full reference: [gitmoji.dev](https://gitmoji.dev/)

## Description Guidelines

### Focus on PURPOSE (Why), Not Implementation (What)

**Rule:** Pick the MAIN architectural change for the subject line. Save details for the body.

✅ **GOOD - Explains WHY:**

| Description                               | Chars | Why It's Good                        |
| ----------------------------------------- | ----- | ------------------------------------ |
| `migrate to nested AGENTS.md pattern`     | 47    | Explains architectural change, short |
| `add skill-creator for generating skills` | 45    | Explains new capability, specific    |
| `fix validation to prevent empty commits` | 45    | Explains problem solved              |
| `refactor to improve token efficiency`    | 39    | Explains optimization goal           |

❌ **BAD - Lists WHAT:**

| Description                                                     | Chars | Why It's Bad                                        |
| --------------------------------------------------------------- | ----- | --------------------------------------------------- |
| `add AGENTS, ADRs, OpenSpec workflows, guides, and PR template` | 73    | TOO LONG! Lists files instead of explaining purpose |
| `update documentation files`                                    | 30    | Too vague, no context                               |
| `refactor code`                                                 | 14    | Doesn't explain what or why                         |
| `standardize agent guidance`                                    | 29    | Generic, could be more specific                     |

### Other Requirements

- **Imperative mood:** "add feature" NOT "added feature"
- **Present tense:** "fix bug" NOT "fixed bug"
- **Lowercase after gitmoji:** `docs: :memo: migrate` NOT `docs: :memo: Migrate`
- **Be specific:** "add skill-creator" NOT "add skill"

## AI Pre-Generation Checklist

Before generating a commit message, AI tools should verify:

1. ✅ Only staged files analyzed (not unstaged/untracked)
2. ✅ All staged files represent ONE logical change
3. ✅ Subject line **40-50 chars (target), 72 MAX** - shorter is better!
4. ✅ Subject focuses on **ONE primary architectural change** - details go in body
5. ✅ Description explains PURPOSE/WHY (not list of files)
6. ✅ Gitmoji is CODE (`:memo:`) not emoji (📝)
7. ✅ Imperative mood, lowercase after gitmoji

**If ANY verification fails, adjust the message before presenting it.**

## Examples

### Good Commits

```bash
# Perfect length, clear purpose
docs: :memo: migrate to nested AGENTS.md pattern

# Feature with scope
feat(meta): :sparkles: add skill-creator for generating skills

# Bug fix
fix(git): :bug: correct smart-commit message validation

# Maintenance
chore(deps): :arrow_up: bump dependencies to latest versions

# Refactoring
refactor(design-system): :recycle: extract component utilities
```

### Bad Commits (With Corrections)

❌ **BAD (79 chars):**

```bash
docs: :memo: add AGENTS, ADRs, OpenSpec workflows, guides, and PR template
```

✅ **FIXED (47 chars):**

```bash
docs: :memo: migrate to nested AGENTS.md pattern
```

---

❌ **BAD (65 chars - generic):**

```bash
docs: :memo: standardize agent guidance and OpenSpec workflows
```

✅ **BETTER (47 chars - specific):**

```bash
docs: :memo: migrate to nested AGENTS.md pattern
```

---

❌ **BAD (vague):**

```bash
feat: add stuff
```

✅ **FIXED:**

```bash
feat(meta): :sparkles: add skill-creator for generating skills
```

## Commit Body

Include a body for complex changes:

```bash
feat(api): :sparkles: add hono-api-builder skill

Implements API endpoint generation with:
- OpenAPI decorator patterns
- Zod validation for request/response schemas
- RPC client/server setup for type safety

The skill follows progressive disclosure pattern.

Closes #42
```

## Related Documentation

- [GitHub Flow](github-flow.md) - Branching strategy and pull requests
- [OpenSpec Workflow](../openspec.md) - Spec-driven development process
- [Development Commands](../development.md) - Common development tasks
- [Conventional Commits](https://www.conventionalcommits.org/) - Official specification
- [gitmoji](https://gitmoji.dev/) - Gitmoji reference
