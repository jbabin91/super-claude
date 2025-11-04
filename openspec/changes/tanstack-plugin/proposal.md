# Proposal: Add TanStack Plugin

## Why

TanStack Start is the preferred fullstack framework, replacing monorepo approaches. Developers need integrated support for the entire TanStack ecosystem (Start, Router, Query, Form, Table) with patterns that work together seamlessly.

## What Changes

Add `plugins/tanstack/` with five Tier 1 skills:

1. **start-wizard** - Fullstack app setup
   - TanStack Start project initialization
   - File-based routing patterns
   - Server functions and RPC setup
   - Integration with Query, Router, Form

2. **query-helper** - Server state management
   - Query key organization patterns
   - Cache invalidation strategies
   - Optimistic updates
   - Server state synchronization

3. **router-helper** - File-based routing
   - Route file generation
   - Loaders and actions
   - Route parameters and search params
   - Layout patterns

4. **form-helper** - Form management
   - Form generation with Zod validation
   - Field-level validation
   - Server action integration
   - Error handling patterns

5. **table-helper** - Data tables
   - Table configuration
   - Filtering, sorting, pagination
   - Column definitions
   - Server-side data integration

## Impact

**Affected specs:**

- `specs/tanstack/` - New plugin capability

**Affected code:**

- `plugins/tanstack/` - New plugin directory
- `plugins/tanstack/skills/start-wizard/SKILL.md`
- `plugins/tanstack/skills/query-helper/SKILL.md`
- `plugins/tanstack/skills/router-helper/SKILL.md`
- `plugins/tanstack/skills/form-helper/SKILL.md`
- `plugins/tanstack/skills/table-helper/SKILL.md`
- `.claude-plugin/marketplace.json` - Add tanstack plugin

**Related docs:**

- `supporting/rationale.md` - Tier 1 priority, skill details, integration patterns
