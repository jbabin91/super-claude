# API Plugin Rationale

**Date:** 2025-10-22 (original brainstorm)
**Priority:** 🔴 Tier 1 - Build First

## Why API Development Tools

API development is frequent and requires type-safe patterns with OpenAPI documentation. Supporting both Hono and Elysia provides flexibility while maintaining end-to-end type safety.

### Tech Stack Context

**Backend:**

- Frameworks: Hono (primary), Elysia (exploration)
- API Patterns: OpenAPI + RPC
- Validation: Zod (primary), ArkType (exploring)
- Auth: better-auth integration
- Database: Drizzle ORM

## Skills Breakdown

### 1. hono-api-builder

Hono API development helper.

**Features:**

- **Route Generation:**
  - OpenAPI decorator patterns
  - Zod validation integration
  - Type-safe route handlers
- **RPC Setup:**
  - Hono RPC client/server
  - End-to-end type safety
  - Client generation
- **Middleware:**
  - Auth middleware (better-auth integration)
  - CORS, logging, error handling
  - Request validation
- **OpenAPI:**
  - Spec generation from routes
  - Swagger UI integration
  - Type generation from spec

**Example Usage:**

```txt
"Create /users GET endpoint"

1. Generate route with OpenAPI decorators
2. Add Zod validation
3. Create RPC client type
4. Add auth middleware
5. Update OpenAPI spec
```

**Integration Points:**

- Hono
- Zod
- better-auth
- Drizzle ORM
- OpenAPI

### 2. elysia-api-builder

Elysia API development helper (alternative to Hono).

**Features:**

- **Route Generation:**
  - Elysia decorator patterns
  - Schema validation (Zod/ArkType)
  - Type-safe handlers
- **Eden RPC:**
  - Eden client setup
  - Type safety across client/server
- **Plugins:**
  - Auth plugin integration
  - Swagger plugin
  - CORS plugin
- **OpenAPI:**
  - Auto-generated docs
  - Type generation

**Example Usage:**

```txt
"Create /posts API with Eden RPC"

1. Define routes with Elysia
2. Add schema validation
3. Generate Eden client
4. Setup Swagger docs
5. Add authentication
```

**Integration Points:**

- Elysia
- Eden RPC
- Zod/ArkType
- better-auth
- Drizzle ORM

## Framework Comparison

### Hono

**Pros:**

- More mature ecosystem
- Better documentation
- Node.js compatible
- Larger community

**Cons:**

- Slightly less performant than Elysia
- RPC setup more manual

**Use Case:** Production applications, team projects

### Elysia

**Pros:**

- Better performance (Bun-optimized)
- Modern API design
- Built-in Eden RPC
- Better type inference

**Cons:**

- Smaller ecosystem
- Less mature
- Bun-specific (mostly)

**Use Case:** New projects, performance-critical, exploring modern patterns

## Integration Patterns

### Hono/Elysia + Drizzle

- End-to-end type safety
- Query builders in routes
- Transaction patterns

### API + TanStack Query

- RPC client generation
- Type-safe mutations
- Optimistic updates

### OpenAPI + TypeScript

- Spec generation from routes
- Client code generation
- Contract testing

## Estimated Impact

**Time Saved:** 10-20 hours per week
**Why:** API development is frequent, type safety prevents bugs

## Related Tools

- **drizzle-maestro** - Database layer for API routes
- **better-auth-integrator** - Authentication middleware
- **tanstack-wizard** - Frontend integration (TanStack Query)

## Decision: Hono vs Elysia

**Build Both:**

- Hono first (more mature, production-ready)
- Elysia second (modern patterns, future-proofing)
- Share common patterns (validation, middleware, RPC)

**Rationale:**

- Users may have preferences
- Elysia is emerging but promising
- Skills can share validation and auth patterns
