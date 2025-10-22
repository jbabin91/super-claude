# Documentation Cleanup Plan (REVISED)

**Date:** October 22, 2025
**Philosophy:** If it's in git history, we don't need to archive it. Delete what's not needed.

## Simple Cleanup Strategy

### Files to DELETE

1. ❌ **ROADMAP.md** - Outdated, not needed
2. ❌ **GETTING_STARTED.md** - Redundant with README
3. ❌ **RESEARCH_FINDINGS.md** - In git history if we need it
4. ❌ **docs/CREATING_SKILLS.md** - Redundant with skill-creator plugin

**Rationale:**

- Git history preserves everything
- No archiving overhead
- Cleaner repo
- README is the starting point

### Files to UPDATE

1. ✏️ **README.md**
   - Add installation instructions
   - Add "Choose Your Stack" examples (TanStack Start, Component Library, Backend API)
   - List new plugins (tanstack-tools, api-tools)
   - Quick start with skill-creator

2. ✏️ **CLAUDE.md**
   - Update tech stack section (TanStack, Base UI, Hono, Drizzle, better-auth)
   - Update priorities (brainstorm Tier 1)
   - Add component file structure standards
   - Add Base UI vs Radix guidance
   - Remove references to obra/superpowers installation

### OpenSpec Proposals

**Current proposals in openspec/changes/:**

- add-changelog-skill
- add-cli-testing-skill
- add-fix-types-skill
- add-generate-tests-skill
- add-pr-description-skill
- add-refactor-imports-skill
- add-smart-commit-skill
- add-worktree-helper-skill

**Decision:** Keep them

- They don't hurt anything
- May be useful reference
- Shows progression of thinking
- If they don't align with brainstorm, just don't implement them

**New proposals to create (Tier 1):**

1. add-component-generator (frontend-tools)
2. add-tanstack-start-wizard (tanstack-tools)
3. add-hono-api-builder (api-tools)
4. add-drizzle-maestro (api-tools)
5. add-better-auth-integrator (api-tools)
6. add-design-system-orchestrator (frontend-tools)

---

## Execution Plan

### Step 1: Delete Files

```bash
rm ROADMAP.md
rm GETTING_STARTED.md
rm RESEARCH_FINDINGS.md
rm docs/CREATING_SKILLS.md
```

### Step 2: Update README.md

Add sections:

- Installation
- Choose Your Stack (TanStack Start, Component Library, Backend)
- Plugin descriptions (tanstack-tools, api-tools)

### Step 3: Update CLAUDE.md

Update sections:

- Tech stack
- Implementation priorities
- Component file structure
- Base UI guidance

### Step 4: Create OpenSpec Proposals

Start with:

- add-component-generator (first to build)

---

## Validation

After cleanup:

- [ ] No redundant getting started content
- [ ] README is the entry point
- [ ] CLAUDE.md reflects brainstorm decisions
- [ ] No archiving overhead
- [ ] Git history preserves everything
- [ ] Old OpenSpec proposals don't block progress

---

**Status:** Ready to execute
**Next:** Delete files, update README and CLAUDE.md
