# Architecture Decision Records Index

This document provides a categorical and chronological index of all Architecture Decision Records (ADRs) in this project.

For guidance on when and how to write ADRs, see [README.md](README.md).

## By Status

### Accepted

- [ADR-0001: Adopt Base UI](decisions/ADR-0001-adopt-base-ui.md)
- [ADR-0002: Use PostgreSQL](decisions/ADR-0002-use-postgresql-primary-db.md)
- [ADR-0003: TanStack Start Over Next.js](decisions/ADR-0003-tanstack-start-over-nextjs.md)
- [ADR-0004: WCAG AAA Accessibility](decisions/ADR-0004-wcag-aaa-accessibility-standard.md)
- [ADR-0005: No Barrel Exports](decisions/ADR-0005-no-barrel-exports.md)
- [ADR-0006: Progressive Disclosure](decisions/ADR-0006-progressive-disclosure-pattern.md)
- [ADR-0007: Skill Auto-Activation](decisions/ADR-0007-skill-auto-activation.md)
- [ADR-0008: No Auto-Formatting Hooks](decisions/ADR-0008-no-auto-formatting-hooks.md)
- [ADR-0009: Token-Efficient Skill Design](decisions/ADR-0009-token-efficient-skill-design.md)
- [ADR-0010: Hook Type Selection](decisions/ADR-0010-hook-type-selection.md)
- [ADR-0011: ArkType for Schema Validation](decisions/ADR-0011-schema-validation-arktype.md)

### Proposed

_None_

### Deprecated

_None_

### Superseded

_None_

## By Category

### Component Libraries

- [ADR-0001: Adopt Base UI](decisions/ADR-0001-adopt-base-ui.md) - Component library choice for all UI work

### Database & ORM

- [ADR-0002: Use PostgreSQL as Primary Database](decisions/ADR-0002-use-postgresql-primary-db.md) - Primary database with Turso/SQLite alternatives

### Frameworks

- [ADR-0003: TanStack Start Over Next.js](decisions/ADR-0003-tanstack-start-over-nextjs.md) - Fullstack framework for maximum type safety

### Standards & Conventions

- [ADR-0004: WCAG AAA Accessibility Standard](decisions/ADR-0004-wcag-aaa-accessibility-standard.md) - Target AAA, minimum AA accessibility level
- [ADR-0005: No Barrel Exports Convention](decisions/ADR-0005-no-barrel-exports.md) - Explicit exports only (no `export *`)

### Patterns & Architecture

- [ADR-0006: Progressive Disclosure Pattern](decisions/ADR-0006-progressive-disclosure-pattern.md) - SKILL.md + API_REFERENCE.md for token efficiency
- [ADR-0007: Skill Auto-Activation System](decisions/ADR-0007-skill-auto-activation.md) - Automatic skill activation based on prompt analysis
- [ADR-0008: No Auto-Formatting Hooks During Conversations](decisions/ADR-0008-no-auto-formatting-hooks.md) - Avoid file-modifying hooks to prevent 160k+ token waste
- [ADR-0009: Token-Efficient Skill Design with Progressive Disclosure](decisions/ADR-0009-token-efficient-skill-design.md) - 500-line limit for SKILL.md, 40-60% token savings
- [ADR-0010: Hook Type Selection (Command vs Prompt)](decisions/ADR-0010-hook-type-selection.md) - Decision matrix for choosing hook execution types

### Tooling & Infrastructure

- [ADR-0011: ArkType for Schema Validation](decisions/ADR-0011-schema-validation-arktype.md) - Multi-layer validation system for plugin manifests and skill frontmatter

## By Date (Chronological)

- **2025-10-22** - Strategic decisions documented (retroactively on 2025-11-04):
  - [ADR-0001: Adopt Base UI](decisions/ADR-0001-adopt-base-ui.md)
  - [ADR-0002: Use PostgreSQL](decisions/ADR-0002-use-postgresql-primary-db.md)
  - [ADR-0003: TanStack Start Over Next.js](decisions/ADR-0003-tanstack-start-over-nextjs.md)
  - [ADR-0004: WCAG AAA Accessibility](decisions/ADR-0004-wcag-aaa-accessibility-standard.md)
  - [ADR-0005: No Barrel Exports](decisions/ADR-0005-no-barrel-exports.md)
  - [ADR-0006: Progressive Disclosure Pattern](decisions/ADR-0006-progressive-disclosure-pattern.md)
  - [ADR-0007: Skill Auto-Activation](decisions/ADR-0007-skill-auto-activation.md)

- **2025-11-06** - Token optimization and hooks guidance based on production evidence:
  - [ADR-0008: No Auto-Formatting Hooks](decisions/ADR-0008-no-auto-formatting-hooks.md)
  - [ADR-0009: Token-Efficient Skill Design](decisions/ADR-0009-token-efficient-skill-design.md)
  - [ADR-0010: Hook Type Selection](decisions/ADR-0010-hook-type-selection.md)

- **2025-11-07** - Schema validation infrastructure to prevent runtime errors:
  - [ADR-0011: ArkType for Schema Validation](decisions/ADR-0011-schema-validation-arktype.md)

## Quick Links

- [README.md](README.md) - ADR usage guide
- [ADR-0000-template.md](decisions/ADR-0000-template.md) - Template for new ADRs
- [../openspec/project.md](../../openspec/project.md) - Project conventions
- [../openspec/AGENTS.md](../../openspec/AGENTS.md) - OpenSpec workflow

## How to Add an ADR

1. Create ADR from template: `cp decisions/ADR-0000-template.md decisions/ADR-NNNN-title.md`
2. Fill in the template with context, decision, alternatives, consequences
3. Review and mark as Accepted
4. **Update this INDEX.md:**
   - Add to "By Status" → "Accepted"
   - Add to appropriate category
   - Add to "By Date" in chronological order
5. Update `openspec/project.md` if the decision affects conventions

## Related Documentation

- [OpenSpec Changes](../../openspec/changes/) - Implementation proposals
- [Project Conventions](../../openspec/project.md) - Current standards
- [OpenSpec Workflow](../../openspec/AGENTS.md) - How to use OpenSpec
