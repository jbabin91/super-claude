# Proposal: Add Database Plugin

## Why

Drizzle ORM is the primary database solution for PostgreSQL, SQLite, and Turso. Developers need consistent patterns for schema definition, migrations, queries, and better-auth integration. Manual database setup leads to inconsistent schemas, unsafe queries, and migration issues.

## What Changes

Add `plugins/database/` with one Tier 1 skill:

1. **drizzle-maestro** - Drizzle ORM development
   - Schema generation with type safety
   - Migration management
   - Query patterns and helpers
   - PostgreSQL, SQLite, Turso support
   - better-auth schema integration
   - Relational queries
   - Connection pooling

## Impact

**Affected specs:**

- `specs/database/` - New plugin capability

**Affected code:**

- `plugins/database/` - New plugin directory
- `plugins/database/skills/drizzle-maestro/SKILL.md`
- `.claude-plugin/marketplace.json` - Add database plugin

**Related docs:**

- `supporting/rationale.md` - Tier 1 priority, skill details, integration patterns

- `docs/2025-10-22/brainstorm.md` - Tier 1 priority
- `docs/2025-10-22/decisions.md` - Drizzle ORM focus
