# Brainstorm Decisions & Clarifications

**Date:** October 22, 2025

## User Clarifications

### 1. Hono vs Elysia

**Decision:** Start with Hono, explore Elysia later

**Rationale:**

- More experience with Hono
- Node.js support (Elysia requires Bun)
- Elysia is on exploration roadmap
- Can build Elysia skill later with same patterns

**Action:** Build `hono-api-builder` first (Tier 1)

---

### 2. Base UI vs Radix UI Strategy

**Decision:** Base UI first, Radix UI aware

**Component Generation:**

- ✅ Generate new components with Base UI only
- ✅ Use `@base-ui-components/react` (single package)
- ❌ Don't generate new Radix UI components

**Migration Support:**

- ✅ Understand Radix UI patterns (for reading existing code)
- ✅ Prefer single `radix-ui` package over individual packages
- ✅ Suggest Base UI alternatives when asked about Radix
- ✅ Provide migration paths from Radix → Base UI

**Action:**

- `component-generator` uses Base UI
- `radix-to-baseui-migrator` understands both

---

### 3. Monorepo Frequency

**Decision:** Lower priority, TanStack Start preferred

**Usage Pattern:**

- Default: TanStack Start (single app)
- Fallback: Monorepo when managing multiple related packages
- Goal: Reduce number of repos to manage

**Action:** Move monorepo tools to Tier 2/3

**Priority Shift:**

- `tanstack-start-wizard` → Higher priority (new Tier 1)
- `turborepo-architect` → Lower priority (Tier 3)
- `pnpm-workspace-manager` → Lower priority (Tier 3)

---

### 4. Storybook vs Testing Priority

**Decision:** Testing first, but Storybook is test infrastructure

**Strategy:**

- Component library projects: Storybook + Vitest (stories ARE tests)
- Domain logic: Separate test files
- **Structure:**

  ```txt
  src/components/ui/button/
    ├── button.tsx
    ├── button.stories.tsx  (includes Vitest component tests)
    └── index.ts            (explicit exports, no barrel export *)

  src/utils/formatters/
    ├── currency.ts
    └── currency.test.ts    (separate test file for functions)
  ```

**File Generation Rules:**

- UI components → `.tsx` + `.stories.tsx` + `index.ts`
- Functions/logic → `.ts` + `.test.ts`
- No `export * from './component-name'` (use explicit exports)

**Action:**

- Testing tools priority unchanged (Tier 2)
- Storybook integration is PART of component testing (not separate)
- `vitest-component-tester` focuses on stories-based testing
- `storybook-automator` generates stories with embedded tests

---

### 5. Testing Priority Order

**Decision:** Unit → Integration → E2E

**Current State:**

- Not extreme testing, but trying to improve
- Pragmatic approach over dogmatic TDD

**Action:** Build testing tools progressively

1. Unit test helpers first
2. Integration patterns
3. E2E generators last

---

## Plugin Grouping Strategy

### Option A: By Technology (Current)

```txt
frontend-tools/
  - component-generator
  - tanstack-wizard
  - radix-to-baseui-migrator
  - design-system-orchestrator

backend-tools/
  - hono-api-builder
  - drizzle-maestro
  - better-auth-integrator

testing-tools/
  - vitest-component-tester
  - storybook-automator
  - playwright-e2e-generator
```

**Pros:**

- Clear separation
- Easy to install just what you need
- Matches current structure

**Cons:**

- Frontend/backend might overlap
- TanStack Start is fullstack (which category?)

---

### Option B: By Use Case

```txt
component-tools/
  - component-generator
  - design-system-orchestrator
  - storybook-automator
  - vitest-component-tester
  - radix-to-baseui-migrator

api-tools/
  - hono-api-builder
  - drizzle-maestro
  - better-auth-integrator
  - schema-validator

fullstack-tools/
  - tanstack-start-wizard
  - tanstack-wizard (Router, Query, Form, Table)
  - type-safety-enforcer

quality-tools/
  - testing suite
  - quality-enforcer
  - playwright-e2e
```

**Pros:**

- User-centric grouping
- Clearer workflow alignment
- TanStack has its own home

**Cons:**

- Some overlap (where does TanStack Query go?)
- More plugins to manage

---

### Option C: Monolithic with Feature Flags

```txt
super-claude-core/
  skills/
    - component-generator
    - hono-api-builder
    - tanstack-wizard
    - drizzle-maestro
    - etc.
  agents/
    - component-designer
    - api-architect
  commands/
    - /scaffold-component
    - /create-api
  hooks/
    - component-validation
    - api-validation
```

**Pros:**

- Single install
- Shared utilities
- Easier version management

**Cons:**

- All-or-nothing installation
- Larger initial download
- Less modular

---

### Recommendation: Hybrid Approach

```txt
# Core (always installed)
super-claude-core/
  - skill-creator
  - plugin-creator
  - quality-enforcer
  - type-safety patterns

# Feature plugins (à la carte)
frontend-tools/
  - component-generator (Base UI)
  - radix-to-baseui-migrator
  - design-system-orchestrator

tanstack-tools/
  - tanstack-start-wizard
  - tanstack-router-helper
  - tanstack-query-helper
  - tanstack-form-helper
  - tanstack-table-helper

api-tools/
  - hono-api-builder
  - drizzle-maestro
  - better-auth-integrator
  - schema-validator

testing-tools/
  - vitest-component-tester (stories-based)
  - storybook-automator
  - playwright-e2e-generator
```

**Why this works:**

- Core tools everyone needs
- TanStack suite gets dedicated plugin (it's a big ecosystem)
- Frontend vs Backend clear separation
- API tools = backend + auth + database
- Testing is cross-cutting

---

## Revised Tier 1 Priorities

Based on decisions above:

### 🔴 Build These First (Tier 1)

1. **tanstack-start-wizard** (tanstack-tools)
   - Your default fullstack approach
   - File-based routing, server functions
   - Integration with Query, Router, Form

2. **component-generator** (frontend-tools)
   - Base UI only
   - Structure: `component-name/` with `.tsx`, `.stories.tsx`, `index.ts`
   - Explicit exports (no `export *`)
   - Stories include Vitest tests

3. **hono-api-builder** (api-tools)
   - OpenAPI + RPC patterns
   - Node.js compatible
   - Type-safe endpoints

4. **drizzle-maestro** (api-tools)
   - PostgreSQL/Turso/SQLite
   - Migration management
   - better-auth integration

5. **better-auth-integrator** (api-tools)
   - Provider setup (email, OAuth)
   - Drizzle schema generation
   - Hono middleware

6. **design-system-orchestrator** (frontend-tools)
   - Tailwind + Base UI
   - WCAG AAA validation
   - Ripple effect analysis

---

## Component File Structure Standards

### UI Components

```txt
src/components/ui/button/
├── button.tsx              # Component implementation
├── button.stories.tsx      # Storybook + Vitest tests combined
└── index.ts                # Explicit exports (export { Button } from './button')
```

**NOT:**

```txt
export * from './button'  ❌
```

**YES:**

```txt
export { Button } from './button'          ✅
export type { ButtonProps } from './button' ✅
```

### Domain Logic / Functions

```txt
src/utils/formatters/
├── currency.ts       # Function implementation
└── currency.test.ts  # Separate test file
```

---

## Base UI Specifics

### Package Installation

```bash
# Single package (preferred)
pnpm add @base-ui-components/react

# NOT individual packages
pnpm add @base-ui/button @base-ui/dialog  ❌
```

### Radix UI Awareness

When encountering existing Radix UI code:

```tsx
// Understand this
import * as Dialog from '@radix-ui/react-dialog';

// Suggest this instead
import { Dialog } from '@base-ui-components/react';
```

When user asks "add a dialog component":

1. Generate with Base UI
2. Mention Radix UI alternative if they're migrating
3. Offer migration help for existing Radix code

---

## Next Steps

1. ✅ Decisions documented
2. ⏳ Update brainstorm.md with revised priorities
3. ⏳ Decide on plugin grouping strategy
4. ⏳ Create OpenSpec proposals for Tier 1 skills
5. ⏳ Start with tanstack-start-wizard or component-generator

---

## Questions Remaining

1. **Plugin Grouping:** Do you prefer Option A (tech-based), Option B (use-case), or Hybrid?
2. **First Skill:** Start with `tanstack-start-wizard` or `component-generator`?
3. **Storybook Stories:** When generating `.stories.tsx`, should tests be inline in same file or separate?
4. **Explicit Exports:** Confirm pattern - `export { Component }` not `export *`?

---

**Status:** 📋 Ready for grouping decision
**Next:** Choose plugin structure, create first OpenSpec proposal
