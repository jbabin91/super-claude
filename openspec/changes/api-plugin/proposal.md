# Proposal: Add API Plugin

## Why

Backend API development with Hono (and Elysia for exploration) requires consistent patterns for OpenAPI, RPC, type safety, and validation. Manual API setup leads to inconsistent error handling, missing validation, and undocumented endpoints.

## What Changes

Add `plugins/api/` with three Tier 1 skills:

1. **hono** - Hono API development (priority)
   - API endpoint generation
   - OpenAPI + RPC patterns
   - Type-safe routes with Zod validation
   - Error handling middleware
   - CORS and security headers
   - Node.js compatible

2. **elysia** - Elysia API development (exploration)
   - Elysia endpoint generation
   - Type-safe routes
   - Bun-specific optimizations
   - Pattern parity with Hono

3. **api** - General API patterns
   - Cross-framework patterns
   - REST best practices
   - OpenAPI documentation
   - Error handling conventions

## Impact

**Affected specs:**

- `specs/api/` - New plugin capability

**Affected code:**

- `plugins/api/` - New plugin directory
- `plugins/api/skills/hono/SKILL.md`
- `plugins/api/skills/elysia/SKILL.md`
- `plugins/api/skills/api/SKILL.md`
- `.claude-plugin/marketplace.json` - Add api plugin

**Related docs:**

- `docs/2025-10-22/brainstorm.md` - Tier 1 priority (Hono), Tier 4 (Elysia)
- `docs/2025-10-22/decisions.md` - Hono first, Elysia exploration
