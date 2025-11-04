# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the super-claude project.

## What is an ADR?

An Architecture Decision Record (ADR) captures a **strategic architectural decision** along with its context, alternatives considered, and consequences. ADRs document the "why" behind important technical choices that affect the project's direction.

## ADR vs OpenSpec vs design.md

Understanding when to use each:

### ADR (Strategic Decision)

**Use when:** Making project-wide architectural or technology choices

**Examples:**

- "Use Base UI instead of Radix UI for all component work"
- "PostgreSQL as the primary database recommendation"
- "WCAG AAA as our accessibility standard"
- "No barrel exports coding convention"

**Characteristics:**

- Project-wide impact
- Affects multiple future implementations
- May not have immediate implementation
- Captures: Context, alternatives, rationale, consequences

**Location:** `docs/architecture/decisions/`

### OpenSpec Proposal (Implementation Plan)

**Use when:** Planning to build or change a feature/capability

**Examples:**

- "Add components plugin with component-generator skill"
- "Implement skill auto-activation system"
- "Create database plugin with Drizzle ORM support"

**Characteristics:**

- Specific feature or change
- Has specs, tasks, and code to write
- References ADRs for strategic context
- Captures: Why (problem), what (changes), impact

**Location:** `openspec/changes/`

### design.md (Implementation Decisions)

**Use when:** Complex implementation needs technical decisions documented

**Examples:**

- "Use AST manipulation vs template strings for code generation"
- "Migration strategy for backward compatibility"
- "Connection pooling approach for this plugin"

**Characteristics:**

- Scoped to a specific change/proposal
- Implementation approach (not strategic choice)
- References ADRs that informed the approach
- Captures: How to build, trade-offs, migration plan

**Location:** `openspec/changes/[change-id]/design.md`

## When to Write an ADR

### Write an ADR when:

- ✅ Choosing between competing technologies (Base UI vs Radix UI)
- ✅ Establishing project-wide standards (WCAG AAA, no barrel exports)
- ✅ Making architectural pattern decisions (progressive disclosure)
- ✅ Setting conventions that affect multiple plugins
- ✅ The decision will be referenced by future work

### Don't write an ADR for:

- ❌ Bug fixes or typos
- ❌ Implementation details for a specific feature (use design.md)
- ❌ Dependency updates (non-breaking)
- ❌ Configuration changes
- ❌ Decisions that only affect a single file/component

## Workflow

### 1. Creating an ADR

```bash
# 1. Copy the template
cp docs/architecture/decisions/ADR-0000-template.md \
   docs/architecture/decisions/ADR-NNNN-descriptive-title.md

# 2. Fill in the template
# - Context: Why is this decision needed?
# - Decision: What are we choosing?
# - Alternatives: What else did we consider?
# - Consequences: What are the impacts?

# 3. Review and discuss
# - Share for team review
# - Gather feedback
# - Update based on discussion

# 4. Mark as Accepted
# - Update Status to "Accepted"
# - Add decision date

# 5. Update INDEX.md
# - Add entry to docs/architecture/INDEX.md
```

### 2. Referencing ADRs in OpenSpec

When creating an OpenSpec proposal that implements or builds on an ADR:

```markdown
# openspec/changes/components-plugin/proposal.md

## Why

Developers need consistent component generation...

## What Changes

Add components plugin with component-generator skill...

**Related ADRs:**

- [ADR-0001: Adopt Base UI](../../docs/architecture/decisions/ADR-0001-adopt-base-ui.md)
- [ADR-0004: WCAG AAA Standard](../../docs/architecture/decisions/ADR-0004-wcag-aaa-standard.md)
```

### 3. Updating Project Conventions

After accepting an ADR, update `openspec/project.md`:

```markdown
## Tech Stack

- **Component Library:** Base UI (see [ADR-0001](../docs/architecture/decisions/ADR-0001-adopt-base-ui.md))
- **Primary Database:** PostgreSQL (see [ADR-0002](../docs/architecture/decisions/ADR-0002-use-postgresql.md))
```

### 4. Superseding an ADR

When a decision needs to change:

```bash
# 1. Create new ADR
ADR-NNNN-new-decision.md

# 2. Update old ADR status
**Status:** Superseded by ADR-NNNN

# 3. Update INDEX.md
# - Mark old ADR as superseded
# - Add new ADR
```

## Numbering Convention

- **ADR-0000** - Template (do not use for real decisions)
- **ADR-0001** through **ADR-0999** - Strategic decisions
- Use zero-padded 4-digit numbers (ADR-0001, ADR-0042, ADR-0123)
- Assign numbers sequentially in order created
- Never reuse numbers (even if an ADR is superseded)

## File Naming

```txt
ADR-NNNN-descriptive-kebab-case-title.md

Examples:
- ADR-0001-adopt-base-ui.md
- ADR-0002-use-postgresql-primary-db.md
- ADR-0003-tanstack-start-over-nextjs.md
```

## ADR Lifecycle

```txt
Proposed → Accepted → [Deprecated] → [Superseded]
```

**Proposed:** Under discussion, not yet accepted

**Accepted:** Approved and in effect

**Deprecated:** No longer recommended but not replaced

**Superseded:** Replaced by a newer ADR

## Templates

**Primary Template:**

- [ADR-0000-template.md](decisions/ADR-0000-template.md) - Full ADR template

Copy this template to create new ADRs.

## Quick Reference

**Browse all ADRs:**

- [INDEX.md](INDEX.md) - Categorical and chronological listing

**Create new ADR:**

```bash
cp docs/architecture/decisions/ADR-0000-template.md \
   docs/architecture/decisions/ADR-NNNN-your-decision.md
```

**Reference in OpenSpec:**

```markdown
**Related ADRs:**

- [ADR-NNNN: Title](../../docs/architecture/decisions/ADR-NNNN-title.md)
```

**Update conventions:**

Edit `openspec/project.md` to link to relevant ADRs

## Examples

See [INDEX.md](INDEX.md) for a list of all ADRs organized by category and date.

## Questions?

- **What's the difference between ADR and design.md?** See "ADR vs OpenSpec vs design.md" above
- **When should I write an ADR?** See "When to Write an ADR" above
- **How do I reference ADRs?** See "Workflow" section above
