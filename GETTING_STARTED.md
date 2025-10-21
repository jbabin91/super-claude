# Getting Started with super-claude

Quick start guide for developing Claude Code enhancements.

## 🚀 First Time Setup

### 1. Install super-claude from Marketplace

```bash
# Add the super-claude marketplace
/plugin marketplace add jbabin91/super-claude

# Install the skill-tools plugin first (meta-tools for creating skills)
/plugin install skill-tools

# Install other plugins as needed
/plugin install typescript-tools
/plugin install testing-tools
/plugin install git-tools
/plugin install frontend-tools
/plugin install devops-tools
```

### 2. Install Foundation Skills (Optional)

```bash
# Get obra/superpowers for TDD and debugging
/plugin marketplace add obra/superpowers

# Get Playwright skill for testing patterns
/plugin marketplace add lackeyjb/playwright-skill

# Get official Anthropic skills
/plugin marketplace add anthropics/skills
```

### 3. Create Your First Skill

Use the skill-creator from the skill-tools plugin:

```bash
# In a Claude Code session, simply ask:
# "Create a new skill for TypeScript type checking"
# The skill-creator will auto-activate and guide you through the process
```

Or create manually:

```bash
# Copy template to your project's .claude/skills/ directory
mkdir -p .claude/skills/typescript
cp ~/.claude/skills/super-claude/configs/templates/SKILL_TEMPLATE.md .claude/skills/typescript/my-skill.md

# Edit the skill
code .claude/skills/typescript/my-skill.md
```

## 📚 Essential Reading

**Before building your first skill, read these in order:**

1. **[CLAUDE.md](./CLAUDE.md)** - Project context and conventions
2. **[RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md)** - Complete ecosystem analysis
3. **[docs/CREATING_SKILLS.md](./docs/CREATING_SKILLS.md)** - RED-GREEN-REFACTOR workflow


## 🎯 What to Build First

Based on research and your projects, prioritize:

### Week 1-2: Foundation

**1. typescript/tsc-files-validation** ⭐ (Highest Priority)

- **Why:** Your expertise, will use frequently
- **Pattern:** playwright-skill universal executor
- **Purpose:** Automated CLI testing across scenarios
- **Tests:** Monorepo, package managers, cross-platform

**2. git/smart-commit**

- **Why:** Use every day across all projects
- **Pattern:** Simple workflow skill
- **Purpose:** Conventional commits with gitmoji
- **Implementation:** Auto-format commit messages

### Week 3-4: Testing & Quality

**3. testing/vitest-integration**

- **Why:** All projects use Vitest
- **Pattern:** Adapt playwright-skill for Vitest runtime
- **Purpose:** Dynamic test generation + execution

**4. typescript/refactor-imports**

- **Why:** Common maintenance task
- **Pattern:** Code transformation skill
- **Purpose:** Path alias management, import cleanup

### Week 5-6: Frontend & Workflows

**5. frontend/component-generator**

- **Why:** Frequent for React projects
- **Pattern:** Code generation skill
- **Purpose:** React component scaffolding with tests

**6. testing/monorepo-testing**

- **Why:** odyssey-frontend is monorepo
- **Pattern:** Multi-package validation
- **Purpose:** Nx/Turborepo/pnpm workspaces support


## 🛠️ Development Workflow

### Creating a New Skill

**1. Plan the Skill**

Use Plan Mode (Shift+Tab twice) to:

- Define the problem skill solves
- Identify activation triggers
- Outline core workflow
- Consider edge cases

**2. Use skill-creator or Create Manually**

Option A - Use skill-creator (recommended):

```bash
# Install skill-tools if not already installed
/plugin install skill-tools

# In Claude Code, ask to create a skill:
# "Create a new skill for [purpose]"
# The skill-creator will guide you through the process
```

Option B - Create manually:

```bash
# For global skills (available across all projects)
mkdir -p ~/.claude/skills/category
cp ~/.claude/skills/super-claude/configs/templates/SKILL_TEMPLATE.md ~/.claude/skills/category/skill-name.md

# For project-specific skills
mkdir -p .claude/skills/category
cp ~/.claude/skills/super-claude/configs/templates/SKILL_TEMPLATE.md .claude/skills/category/skill-name.md
```

**3. RED Phase - Document Failures**

```bash
# Open Claude Code WITHOUT the skill
# Try scenarios that should fail
# Document:
# - Baseline behavior
# - Agent rationalizations (verbatim)
# - Specific failure modes
```

**4. GREEN Phase - Minimal Implementation**

```bash
# Edit skill with:
# 1. YAML frontmatter (triggers, description)
# 2. When to Use section
# 3. Core Workflow
# 4. Example scenarios

# Test in Claude Code
# Verify agents comply with skill
```

**5. REFACTOR Phase - Harden**

```bash
# Identify new rationalizations
# Add explicit counters in skill
# Re-test until bulletproof
# Add edge cases and troubleshooting
```

**6. Progressive Disclosure (if needed)**

For complex skills > 500 lines:

```bash
# Create API reference in same directory
touch <skill-directory>/API_REFERENCE.md

# Move advanced content to API_REFERENCE.md
# Keep SKILL.md < 500 lines
# Link from SKILL.md to API_REFERENCE.md
```

### Testing Your Skill

**Manual Testing (Required):**

1. Open Claude Code in a relevant project
2. Start conversation that should trigger skill
3. Verify Claude uses skill appropriately
4. Check for failures or rationalizations
5. Iterate based on observations

**Subagent Testing (Advanced):**

```bash
# Use superpowers subagent testing pattern
# 1. Create test scenarios (describe what should happen)
# 2. Run WITHOUT skill (document failures)
# 3. Run WITH skill (verify compliance)
# 4. Iterate until all tests pass
```

### Universal Executor Pattern (For Test Skills)

If building skills that generate and execute code:

```javascript
// skills/category/skill-name/run.js

export async function execute(code, context) {
  // 1. Create temp file with proper module context
  const tempFile = await createTempFile(code, context);

  // 2. Set up environment with dependencies available
  const env = setupEnvironment(context);

  // 3. Execute with proper module resolution
  const result = await executeInContext(tempFile, env);

  // 4. Parse results (JSON, coverage, console)
  const parsed = parseResults(result);

  // 5. Clean up without race conditions
  await safeCleanup(tempFile);

  return parsed;
}
```

See `RESEARCH_FINDINGS.md` → "lackeyjb/playwright-skill" for complete example.

## 📝 Skill Template Quick Reference

**Required YAML Frontmatter:**

```yaml
---
name: skill-identifier              # kebab-case, unique
version: 1.0.0                      # semantic versioning
description: |
  What it does + when to use.
  Include activation triggers.
category: workflow-automation       # typescript, frontend, testing, git, devops
tags: [tag1, tag2, tag3]
model: sonnet                       # sonnet (default) | haiku | opus
requires:
  tools: [git, npm]                # External dependencies
triggers:
  keywords: [keyword1, keyword2]   # Search terms
  patterns: ["pattern1"]           # Regex patterns
  contexts: [development, testing] # When to activate
---
```

**Content Structure:**

```markdown
# Skill Name

Brief overview (1-2 sentences).

## When to Use
- Concrete triggers
- Specific scenarios

## Core Workflow
### 1. Step One
### 2. Step Two

## Best Practices
- Practice 1
- Practice 2

## Example Workflows
### Scenario 1: Common Use Case
### Scenario 2: Edge Case

## Integration Points
- Works with: other skills
- Calls: agents/tools

## Troubleshooting
### Issue 1
### Issue 2

## References
- Links to docs
```


## 📊 Tracking Progress

### Current Status

- ✅ Repository scaffold complete
- ✅ Documentation and guides written
- ✅ Research findings compiled
- ✅ Installation scripts created
- ⏳ Skills to build (see priorities above)

### Next Milestones

**Milestone 1: Foundation Complete** (Week 2)

- [ ] tsc-files-validation skill
- [ ] git/smart-commit skill
- [ ] obra/superpowers installed

**Milestone 2: Testing Infrastructure** (Week 4)

- [ ] vitest-integration skill
- [ ] typescript/refactor-imports skill
- [ ] coverage-improve skill

**Milestone 3: Frontend Workflows** (Week 6)

- [ ] component-generator skill
- [ ] monorepo-testing skill
- [ ] tailwind-helper skill

## 🎓 Learning Resources

### Patterns to Study

**From RESEARCH_FINDINGS.md:**

1. **Progressive Disclosure** (Anthropic)
   - SKILL.md < 500 lines
   - API_REFERENCE.md for advanced topics
   - ~2.5x token savings

2. **Universal Executor** (playwright-skill)
   - Dynamic code execution + module resolution
   - Safe temp file cleanup
   - Essential for test framework skills

3. **RED-GREEN-REFACTOR** (superpowers)
   - Document failures first
   - Minimal implementation
   - Harden iteratively

4. **Validation Framework** (agent-skill-creator)
   - Parameter validation
   - Data validation
   - Temporal validation
   - Completeness validation

### Example Skills to Reference

**Simple Workflow:**

- obra/superpowers → `git-worktrees`
- obra/superpowers → `finishing-development-branch`

**Complex Automation:**

- lackeyjb/playwright-skill → Universal executor
- anthropics/skills → `artifacts-builder`

**Code Generation:**

- anthropics/skills → `mcp-builder`
- jeremylongshore/claude-code-plugins-plus → Design-to-code plugin

## 🚫 Common Pitfalls to Avoid

Based on community research:

1. **Don't deploy untested skills** - Always test manually first
2. **Don't create narrative examples** - Use generic, reusable scenarios
3. **Don't use generic labels** - "helper1", "utils", "step2" are unhelpful
4. **Don't embed code in flowcharts** - Code should be copy-pasteable
5. **Don't include TODOs** - Skills should be production-ready
6. **Don't commit local/ directory** - Work skills are private
7. **Don't skip progressive disclosure** - Keep skills < 500 lines
8. **Don't forget activation triggers** - Skills must be discoverable

## ✅ Pre-Commit Checklist

Before committing new skills:

- [ ] Skill tested manually in Claude Code
- [ ] YAML frontmatter complete and valid
- [ ] Description includes activation triggers
- [ ] < 500 lines or uses progressive disclosure
- [ ] Examples are generic (no project-specific content)
- [ ] No TODOs or placeholders
- [ ] Documentation updated if needed
- [ ] No personal config files staged
- [ ] Commit message follows conventions

## 🆘 Getting Help

### Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Project overview
- **[RESEARCH_FINDINGS.md](./RESEARCH_FINDINGS.md)** - Deep research
- **[docs/CREATING_SKILLS.md](./docs/CREATING_SKILLS.md)** - How-to guide

### Community Resources

- **obra/superpowers** - Best practices, TDD workflows
- **anthropics/skills** - Official examples
- **lackeyjb/playwright-skill** - Universal executor pattern

### Quick Commands

```bash
# Install from marketplace
/plugin marketplace add jbabin91/super-claude
/plugin install skill-tools

# Create skill using skill-creator
# Just ask in Claude Code: "Create a new skill for [purpose]"

# Or copy template manually
cp ~/.claude/skills/super-claude/configs/templates/SKILL_TEMPLATE.md <destination>
```

---

**Ready to build your first skill?** Start with `typescript/tsc-files-validation` using the playwright-skill universal executor pattern! 🚀
