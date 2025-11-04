# Proposal: Add Auth Plugin

## Why

Authentication is critical for most applications. better-auth provides a modern, type-safe auth solution, but setup requires integration with database schemas, API routes, and middleware. Consistent patterns reduce security risks and implementation time.

## What Changes

Add `plugins/auth/` with one Tier 1 skill:

1. **better-auth** - better-auth setup and integration
   - Authentication provider configuration (email, OAuth)
   - Drizzle schema generation for auth tables
   - Hono middleware integration
   - Session management
   - Protected route patterns
   - Frontend auth hooks
   - Type-safe auth context

## Impact

**Affected specs:**

- `specs/auth/` - New plugin capability

**Affected code:**

- `plugins/auth/` - New plugin directory
- `plugins/auth/skills/better-auth/SKILL.md`
- `.claude-plugin/marketplace.json` - Add auth plugin

**Related docs:**

- `supporting/rationale.md` - Tier 1 priority, skill details, integration patterns

- `docs/2025-10-22/brainstorm.md` - Tier 1 priority
- `docs/2025-10-22/decisions.md` - better-auth focus
