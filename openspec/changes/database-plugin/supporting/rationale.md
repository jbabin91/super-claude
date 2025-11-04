# Database Plugin Rationale

**Date:** 2025-10-22 (original brainstorm)
**Priority:** 🔴 Tier 1 - Build First

## Why Database Tools First

Database is the foundation for all backend work. Drizzle ORM provides type-safe database access with excellent DX, and mastering it saves hours of boilerplate and prevents migration issues.

### Tech Stack Context

**Database:**

- ORM: Drizzle ORM
- Primary DB: PostgreSQL
- Also supports: Turso, SQLite
- Auth Integration: better-auth (user tables)
- Validation: Zod (schema validation)

## Skills Breakdown

### drizzle-maestro

Drizzle ORM development helper.

**Features:**

- **Schema Management:**
  - Generate from TypeScript types
  - Relation builder (one-to-many, many-to-many)
  - Index and constraint helpers
- **Migrations:**
  - Migration creation
  - Migration safety checks
  - Rollback strategies
  - Seed data management
- **Query Helpers:**
  - Common query patterns
  - Type-safe query builder
  - Transaction patterns
- **PostgreSQL Optimization:**
  - Index recommendations
  - Query performance analysis
- **Multi-DB Support:**
  - PostgreSQL (primary)
  - Turso/SQLite variants

**Example Usage:**

```txt
"Create User schema with posts relation"

1. Define users table
2. Define posts table (foreign key to users)
3. Generate one-to-many relation
4. Create migration
5. Generate seed data helper
```

**Integration Points:**

- Drizzle ORM
- PostgreSQL, SQLite, Turso
- better-auth (user tables)
- Zod (schema validation)

## Common Patterns

### Schema Definition

- TypeScript types → Drizzle schema
- Automatic inference for query results
- Type-safe relations

### Migration Safety

- Detect breaking changes
- Review before applying
- Seed data compatibility

### Query Building

- Common patterns (findById, findMany, pagination)
- Transaction patterns
- Relation loading strategies

## Integration Patterns

### Drizzle + better-auth

- User table integration
- Session storage
- Auth state in database

### Drizzle + Hono/Elysia

- Query builders in routes
- Transaction patterns
- Connection pooling

### Drizzle + Zod

- Schema validation for inserts
- Runtime type safety
- API contract enforcement

## Estimated Impact

**Time Saved:** 10-20 hours per week
**Why:** Database is foundation, migrations are error-prone without tooling

## Related Tools

- **hono-api-builder** / **elysia-api-builder** - API routes using Drizzle
- **better-auth-integrator** - User/session tables
- **schema-validator** - Zod schema generation from Drizzle types

## Multi-Database Support

### PostgreSQL (Primary)

- Full feature support
- Production-ready
- Best performance for complex queries

### Turso

- SQLite-compatible
- Edge deployment
- Distributed replicas
- Cost-effective for small/medium apps

### SQLite

- Local development
- Testing
- Embedded applications
- File-based storage

## Migration Strategy

**Approach:**

- Generate migrations from schema changes
- Review migrations before applying
- Keep seed data in sync
- Rollback capability for safety

**Safety Checks:**

- Detect data loss risks
- Warn about breaking changes
- Validate foreign key integrity
- Check index coverage
