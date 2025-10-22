# Documentation Cleanup Plan

**Date:** October 22, 2025
**Purpose:** Align documentation with brainstorm decisions and hybrid plugin structure

## Analysis Summary

### Files to Review

1. ❌ **ROADMAP.md** - Outdated, references old priorities (tsc-files, obra/superpowers)
2. ❌ **GETTING_STARTED.md** - Outdated, same old priorities
3. ❌ **RESEARCH_FINDINGS.md** - Still valuable reference, KEEP but maybe move to docs/archive/
4. ⚠️ **CLAUDE.md** - Needs major update with new tech stack and priorities
5. ⚠️ **README.md** - Needs update for tanstack-tools and api-tools plugins
6. ❌ **docs/CREATING_SKILLS.md** - Redundant with skill-creator skill
7. ⚠️ **openspec/** proposals - Misaligned with brainstorm (git/typescript focus vs frontend/tanstack)

---

## Recommendations

### 1. ROADMAP.md - **ARCHIVE**

**Current State:**

- References obra/superpowers installation
- Focuses on typescript-tools, git-tools
- Mentions tsc-files-validation (not in our brainstorm)
- Milestones are weeks-based (outdated timeline)

**Action:** Move to `docs/archive/ROADMAP-v0.2.0.md`

**Reason:** We have a new direction from brainstorm. The roadmap should reflect:

- TanStack Start > monorepos
- Base UI components (not generic React)
- Hono/Drizzle/better-auth focus
- Component testing in Storybook stories

---

### 2. GETTING_STARTED.md - **DELETE**

**Current State:**

- Recommends installing obra/superpowers
- Week-by-week plan for tsc-files-validation, smart-commit
- References playwright-skill pattern
- Focus on TypeScript tooling

**Action:** Delete entirely

**Reason:** Redundant with README.md

- README should have installation instructions
- README should have "Choose Your Stack" examples
- No need for separate getting started doc
- One source of truth is better

**README.md will cover:**

- Quick install
- Plugin selection by use case
- First skill creation with skill-creator

---

### 3. RESEARCH_FINDINGS.md - **ARCHIVE (Keep as Reference)**

**Current State:**

- Comprehensive analysis of 11 repos
- 200+ skills cataloged
- Valuable patterns (progressive disclosure, universal executor, RED-GREEN-REFACTOR)

**Action:** Move to `docs/archive/RESEARCH_FINDINGS.md`

**Reason:**

- Still valuable reference material
- Patterns are still relevant
- But not part of active getting started flow
- Can reference when needed

**Keep in Archive Because:**

- Universal executor pattern applies to our testing tools
- Progressive disclosure is best practice
- RED-GREEN-REFACTOR methodology still valid

---

### 4. CLAUDE.md - **UPDATE**

**Current State (Needs Major Update):**

**Section: Tech Stack**

```markdown
Focus: TypeScript, React, Node.js, Testing, Git workflows ❌
```

Should be:

```markdown
Focus: TanStack Start, Base UI, Hono, Drizzle, better-auth ✅
```

**Section: Implementation Priorities**

```markdown
1. typescript/tsc-files-validation ❌
2. git/smart-commit ❌
3. Install obra/superpowers ❌
```

Should be from brainstorm Tier 1:

```markdown
1. tanstack-start-wizard (tanstack-tools) ✅
2. component-generator (frontend-tools) - Base UI ✅
3. hono-api-builder (api-tools) ✅
4. drizzle-maestro (api-tools) ✅
5. better-auth-integrator (api-tools) ✅
6. design-system-orchestrator (frontend-tools) ✅
```

**Section: Skill Categories**

Add:

```markdown
### TanStack Tools

- TanStack Start fullstack apps
- Router, Query, Form, Table integration
- Server functions and RPC

### API Tools

- Hono/Elysia API development
- Drizzle ORM (PostgreSQL, Turso, SQLite)
- better-auth authentication
- Zod/ArkType validation
```

Update:

```markdown
### Frontend Tools

- Base UI component generation ✅ (not generic React)
- Radix UI migration support ✅
- Design system with WCAG AAA ✅
- Tailwind utilities ✅
```

**Section: Component File Structure**

Add new section:

```markdown
## Component File Structure Standards

### UI Components (with Storybook)

src/components/ui/button/
├── button.tsx # Component
├── button.stories.tsx # Storybook + Vitest tests
└── index.ts # Explicit exports

export { Button } from './button' ✅
export type { ButtonProps } from './button' ✅

NOT: export \* from './button' ❌

### Domain Logic

src/utils/formatters/
├── currency.ts # Implementation
└── currency.test.ts # Separate test file
```

**Section: Base UI Specifics**

Add:

```markdown
## Base UI vs Radix UI

### New Components

- Generate with Base UI (@base-ui-components/react)
- Single package (not individual @base-ui/button, etc.)

### Existing Radix Code

- Understand for migration
- Prefer single radix-ui package
- Suggest Base UI alternatives
- Offer migration paths
```

---

### 5. README.md - **UPDATE**

**Add New Plugins:**

```markdown
## 📦 Available Plugins

### Core

- **skill-tools** - Meta-tools for creating skills ✅

### Feature Plugins (NEW)

#### tanstack-tools 🆕

TanStack ecosystem integration (Start, Router, Query, Form, Table)

- tanstack-start-wizard - Fullstack app setup
- tanstack-query-helper - Server state patterns
- tanstack-form-helper - Forms + Zod validation

#### api-tools 🆕

Backend API development (Hono, Drizzle, better-auth)

- hono-api-builder - API endpoints with OpenAPI + RPC
- drizzle-maestro - Database schema & migrations
- better-auth-integrator - Authentication providers
- schema-validator - Zod/ArkType helpers

#### frontend-tools ⚠️ (Updated)

React/UI development with Base UI focus

- component-generator - Base UI components + Storybook
- design-system-orchestrator - Theming + WCAG AAA
- radix-to-baseui-migrator - Migration helper

#### testing-tools ⚠️ (Updated)

Testing automation (Storybook-based component tests)

- vitest-component-tester - Tests in .stories.tsx files
- storybook-automator - Story generation
- playwright-e2e-generator - E2E testing

#### devops-tools, git-tools, typescript-tools

- Lower priority, same as before
```

**Update Installation Examples:**

```markdown
## Use Case Examples

### TanStack Start Fullstack App

/plugin marketplace add jbabin91/super-claude
/plugin install skill-tools
/plugin install tanstack-tools # Router, Query, Form
/plugin install api-tools # Hono, Drizzle, auth

### Component Library

/plugin install skill-tools
/plugin install frontend-tools # Base UI components
/plugin install testing-tools # Storybook testing
```

---

### 6. docs/CREATING_SKILLS.md - **REMOVE or REDUCE**

**Current State:**

- Comprehensive guide (224 lines)
- RED-GREEN-REFACTOR methodology
- YAML frontmatter guide
- Universal executor pattern

**Problem:** Redundant with skill-creator skill

**Options:**

**Option A: Remove Entirely**

- skill-creator already teaches this
- Reduces maintenance burden
- One source of truth

**Option B: Keep Minimal Version**

- Just link to skill-creator
- Quick reference for YAML format
- 20-30 lines max

**Recommendation:** Option B - Minimal version

```markdown
# Creating Skills

Use the skill-creator from skill-tools plugin:

/plugin install skill-tools

Then in Claude Code:
"Create a skill for [purpose]"

## Quick Reference

YAML frontmatter:
name: skill-identifier
description: What it does + when to use

See skill-creator for full guide.
See docs/2025-10-22/brainstorm.md for ideas.
```

---

### 7. openspec/ Proposals - **REVIEW and REALIGN**

**Current Proposals:**

```txt
openspec/changes/
├── add-changelog-skill          ❌ Not in brainstorm
├── add-cli-testing-skill        ❌ (tsc-files, not our focus)
├── add-fix-types-skill          ❌ Not in brainstorm
├── add-generate-tests-skill     ❌ Generic, not Storybook-based
├── add-pr-description-skill     ❌ Not in brainstorm
├── add-refactor-imports-skill   ❌ Not in brainstorm
├── add-smart-commit-skill       ❌ Not in brainstorm
└── add-worktree-helper-skill    ❌ Not in brainstorm
```

**None of these align with our brainstorm!**

**Action Options:**

**Option A: Archive All**

- Move to openspec/archive/pre-brainstorm/
- Start fresh with brainstorm proposals

**Option B: Keep Selectively**

- Keep smart-commit (useful even if not priority)
- Archive rest
- Add brainstorm proposals

**Recommendation:** Option A - Clean slate

**New Proposals Needed (Tier 1):**

1. add-tanstack-start-wizard (tanstack-tools)
2. add-component-generator (frontend-tools)
3. add-hono-api-builder (api-tools)
4. add-drizzle-maestro (api-tools)
5. add-better-auth-integrator (api-tools)
6. add-design-system-orchestrator (frontend-tools)

---

## Action Plan

### Step 1: Archive and Delete Legacy Docs

```bash
mkdir -p docs/archive
mv ROADMAP.md docs/archive/ROADMAP-v0.2.0.md
rm GETTING_STARTED.md  # Delete - redundant with README
mv RESEARCH_FINDINGS.md docs/archive/RESEARCH_FINDINGS.md
```

### Step 2: Archive Old OpenSpec Proposals

```bash
mkdir -p openspec/archive/pre-brainstorm
mv openspec/changes/* openspec/archive/pre-brainstorm/
```

### Step 3: Update Core Documentation

- [ ] Update CLAUDE.md (new tech stack, priorities, file structure)
- [ ] Update README.md (new plugins, use cases)
- [ ] Reduce docs/CREATING_SKILLS.md (minimal version, link to skill-creator)

### Step 4: Create New Files

- [ ] New ROADMAP.md (based on brainstorm Tiers)

### Step 5: Create OpenSpec Proposals

- [ ] add-component-generator (Tier 1, highest priority)
- [ ] add-tanstack-start-wizard (Tier 1)
- [ ] add-hono-api-builder (Tier 1)
- [ ] add-drizzle-maestro (Tier 1)
- [ ] add-better-auth-integrator (Tier 1)
- [ ] add-design-system-orchestrator (Tier 1)

---

## Validation Checklist

After cleanup, verify:

- [ ] All docs reference Base UI (not generic React)
- [ ] All docs reference TanStack Start (not generic fullstack)
- [ ] All docs reference Hono/Drizzle/better-auth
- [ ] Component structure shows explicit exports
- [ ] Storybook + Vitest integration clear
- [ ] No references to obra/superpowers installation
- [ ] No references to tsc-files-validation
- [ ] Hybrid plugin structure (core + features) documented
- [ ] tanstack-tools and api-tools listed
- [ ] OpenSpec proposals aligned with brainstorm Tier 1

---

**Status:** 📋 Ready to execute cleanup
**Next:** Get approval, then execute step-by-step
