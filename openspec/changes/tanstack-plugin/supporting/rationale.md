# TanStack Plugin Rationale

**Date:** 2025-10-22 (original brainstorm)
**Priority:** 🔴 Tier 1 - Build First

## Why TanStack First

TanStack Start is our preferred fullstack framework, replacing monorepo approaches. The entire TanStack ecosystem (Start, Router, Query, Form, Table) requires integrated support with patterns that work together seamlessly.

### Tech Stack Context

**Frontend:**

- Framework: React + Vite
- Routing: TanStack Router (file-based)
- Data Fetching: TanStack Query
- Tables: TanStack Table
- Forms: TanStack Form
- Validation: Zod (primary), ArkType (exploring)

**Fullstack:**

- Meta-framework: TanStack Start
- Server Functions: Built-in TanStack Start routes

## Skills Breakdown

### 1. start-wizard

**Features:**

- **TanStack Router:**
  - File-based routing setup
  - Route type generation
  - Loader patterns
  - Navigation helpers
- **TanStack Query:**
  - QueryClient configuration
  - DevTools setup
  - Query hook generation from API types
  - Optimistic update patterns
  - Cache management strategies
- **TanStack Table:**
  - Column definitions from TypeScript types
  - Filtering, sorting, pagination
  - Server-side vs client-side patterns
- **TanStack Form:**
  - Zod schema integration
  - Field validation patterns
  - Multi-step form setup
  - Optimistic updates with Query
- **Cross-Integration:**
  - Router + Query (data preloading)
  - Form + Query (mutations)
  - Table + Query (server pagination)

**Example Usage:**

```txt
"Setup TanStack Query with user API"

1. Configure QueryClient
2. Generate useUsers() hook
3. Add DevTools
4. Create mutation hooks
5. Setup optimistic updates
```

**Integration Points:**

- Zod (form validation)
- Hono/Elysia RPC (type-safe queries)
- TypeScript (type generation)

### 2. query-helper

Server state management patterns for TanStack Query.

**Features:**

- Query key organization patterns
- Cache invalidation strategies
- Optimistic updates
- Server state synchronization

### 3. router-helper

File-based routing with TanStack Router.

**Features:**

- Route file generation
- Loaders and actions
- Route parameters and search params
- Layout patterns

### 4. form-helper

Form management with TanStack Form.

**Features:**

- Form generation with Zod validation
- Field-level validation
- Server action integration
- Error handling patterns

### 5. table-helper

Data tables with TanStack Table.

**Features:**

- Table configuration
- Filtering, sorting, pagination
- Column definitions
- Server-side data integration

## Integration Patterns

### TanStack Query + TanStack Router

- Data preloading on route navigation
- Loader functions with Query
- Prefetching strategies

### TanStack Form + Zod

- Schema-based validation
- Type-safe form state
- Error message generation

### TanStack Query + Hono/Elysia

- End-to-end type safety
- RPC integration
- Type-safe mutations

## Estimated Impact

**Time Saved:** 10-20 hours per week
**Why:** Complex suite setup, frequent use, enables other integrations

## Related Tools

- **component-generator** - UI components for forms and tables
- **hono-api-builder** - Backend API for Query integration
- **drizzle-maestro** - Database layer for server-side data

## Questions Addressed

**Testing Strategy:**

- Unit tests (Vitest) → Integration → E2E (Playwright)
- Focus on integration tests for cross-TanStack features

**Storybook vs Testing:**

- Testing > Storybook (quality focus)
- But both are valuable for component-driven workflows
