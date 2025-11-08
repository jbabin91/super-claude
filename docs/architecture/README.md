# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the super-claude project.

## What is an ADR?

An Architecture Decision Record (ADR) captures a **strategic architectural decision** along with its context, alternatives considered, and consequences. ADRs document the "why" behind important technical choices that affect the project's direction.

## Complete Development Workflow

This section helps you decide: **ADR? OpenSpec? Or just implement?**

### Quick Reference Flowchart

```txt
START: I need to work on something

├─ Q1: Is this routine work?
│  (bug fix, typo, docs, non-breaking updates, config)
│  ├─ YES → Implement directly ✓
│  └─ NO → Q2
│
├─ Q2: Am I choosing between alternatives OR setting project-wide standards?
│  (Examples: ArkType vs Zod, WCAG AAA vs AA, no barrel exports)
│  ├─ YES → ADR (Proposed) → Review → ADR (Accepted) → Q3
│  └─ NO → Q3
│
└─ Q3: Does this add/change/remove capabilities?
   (new plugin/skill, spec changes, breaking changes)
   ├─ YES → OpenSpec → Implement
   └─ NO → Implement directly ✓
```

### Impact-Level Framework

Use these levels to understand the scope and required process:

#### Level 1: Project-Wide Impact

**Triggers:**

- Affects 2+ plugins OR
- Establishes convention/standard OR
- First-time technology choice OR
- Sets patterns that future work follows

**Examples:**

- Choosing ArkType vs Zod for validation
- Establishing WCAG AAA accessibility standard
- Deciding on "no barrel exports" convention
- Selecting Base UI over Radix UI

**Process:**

1. Write ADR (Status: Proposed)
2. Document context, decision, alternatives, consequences
3. Review and discuss
4. Mark as Accepted (Status: Accepted + date)
5. Update INDEX.md
6. [If builds something] Create OpenSpec proposal
7. Implement

#### Level 2: Plugin/Capability Impact

**Triggers:**

- New plugin, skill, command, hook, or agent OR
- Changes existing specs/behavior OR
- Breaking changes OR
- Multi-step feature implementation

**Examples:**

- Add "hook-creator" skill to meta plugin
- Create new testing plugin
- Modify existing skill behavior
- Add new command to workflow plugin

**Process:**

1. Check: Is there an Accepted ADR for the approach/technology?
   - NO → Escalate to Level 1 (write ADR first)
   - YES → Continue
2. Write OpenSpec proposal (references relevant ADRs)
3. Create tasks.md and spec deltas
4. Validate with `openspec validate --strict`
5. Implement

#### Level 3: Code-Level Impact

**Triggers:**

- Bug fixes (restore spec behavior) OR
- Documentation updates OR
- Refactoring (no behavior change) OR
- Typos, formatting corrections OR
- Non-breaking dependency updates OR
- Configuration changes

**Examples:**

- Fix broken hooks schema
- Update README with new commands
- Refactor internal function (no API change)
- Fix typo in error message

**Process:**

1. Implement directly
2. Test
3. Commit

### Detailed Decision Criteria

Use these prompts when you're unsure which level applies:

#### Is this Level 1 (ADR needed)?

Ask yourself:

- **"Am I comparing Technology A vs Technology B?"**
  - Examples: ArkType vs Zod, Vitest vs Jest, PostgreSQL vs SQLite
  - → If YES: Level 1

- **"Am I establishing a standard that applies project-wide?"**
  - Examples: WCAG AAA accessibility, no barrel exports, progressive disclosure pattern
  - → If YES: Level 1

- **"Is this the first time we're solving this type of problem?"**
  - Examples: First validation system, first testing approach, first hook pattern
  - → If YES: Level 1

- **"Will multiple future features reference this decision?"**
  - Examples: Component library choice affects all UI work, database choice affects all data plugins
  - → If YES: Level 1

#### Is this Level 2 (OpenSpec needed)?

Ask yourself:

- **"Does this add new functionality to the project?"**
  - Examples: New skill, new plugin, new command
  - → If YES: Level 2

- **"Will this change existing specs or behavior?"**
  - Examples: Modify how skill activation works, change validation rules
  - → If YES: Level 2

- **"Is this a multi-step implementation?"**
  - Examples: Requires planning, task tracking, spec deltas
  - → If YES: Level 2

- **"Could this break existing functionality?"**
  - Examples: API changes, schema modifications, behavior changes
  - → If YES: Level 2

#### Is this Level 3 (Direct implementation)?

Check if it matches:

- ✓ Bug fix (restore intended behavior per spec)
- ✓ Documentation update (README, guides)
- ✓ Typo or formatting correction
- ✓ Non-breaking dependency update
- ✓ Configuration change (settings, .gitignore)
- ✓ Refactoring (no behavior change)

→ If MATCH: Level 3 (just implement)

### Complete Example Flows

#### Example 1: Schema Validation System

**Situation:** Workflow plugin broken due to invalid schema. Need validation system.

**Decision process:**

1. **Level check:** Choosing validation library (ArkType vs Zod vs JSON Schema)
   - Technology choice → Level 1
2. **Process:**
   - Write ADR-0011: ArkType for Schema Validation
   - Document alternatives (Zod, JSON Schema, custom)
   - Review decision, rationale, consequences
   - Mark ADR-0011 as Accepted
   - Create OpenSpec: `add-schema-validation`
   - Reference ADR-0011 in proposal.md
   - Implement validation system

**Path:** Level 1 → ADR → Accepted → Level 2 → OpenSpec → Implement

#### Example 2: Add New Skill to Meta Plugin

**Situation:** Want to add "hook-creator" skill to meta plugin

**Decision process:**

1. **Level check:** New skill, specs will change
   - New capability → Level 2
2. **ADR check:** Is there an ADR for skill creation patterns?
   - YES: ADR-0009 (Token-Efficient Skill Design), ADR-0006 (Progressive Disclosure)
   - Patterns established, no new strategic decision
3. **Process:**
   - Create OpenSpec: `add-hook-creator-skill`
   - Reference ADR-0009 and ADR-0006 in proposal
   - Write tasks.md and spec deltas
   - Implement

**Path:** Level 2 → OpenSpec → Implement

#### Example 3: Fix Typo in README

**Situation:** Found typo in project README

**Decision process:**

1. **Level check:** Documentation correction
   - Routine work → Level 3
2. **Process:**
   - Fix typo directly
   - Commit with descriptive message

**Path:** Level 3 → Implement

#### Example 4: First Testing Plugin with Vitest

**Situation:** Want to add testing automation, need to choose test framework

**Decision process:**

1. **Level check:** First-time testing approach, choosing Vitest vs Jest vs other
   - Technology choice + first-time → Level 1
2. **Process:**
   - Write ADR-NNNN: Vitest for Component Testing
   - Compare Vitest, Jest, Testing Library approaches
   - Document why Vitest (Vite integration, speed, API)
   - Mark as Accepted
   - Create OpenSpec: `testing-plugin`
   - Reference ADR-NNNN in proposal
   - Implement

**Path:** Level 1 → ADR → Accepted → Level 2 → OpenSpec → Implement

### Edge Cases

#### Discover ADR need mid-implementation

**Situation:** Started building feature, realized you're making a strategic choice

**What to do:**

1. Pause implementation
2. Write ADR documenting the decision
3. Get ADR accepted
4. Update OpenSpec proposal to reference ADR
5. Continue implementation

#### ADR without implementation

**Situation:** ADR establishes convention but doesn't require building anything

**Example:** "No barrel exports" convention

**What to do:**

1. Write ADR
2. Mark as Accepted
3. Update `openspec/project.md` conventions
4. No OpenSpec needed

#### Multiple proposals from one ADR

**Situation:** One strategic decision affects multiple features

**Example:** ADR-0001 (Adopt Base UI) → Multiple plugins use Base UI

**What to do:**

1. Write ADR once
2. Mark as Accepted
3. Multiple OpenSpec proposals can reference it
4. Each proposal implements different features using the decision

#### Urgent bug fix reveals architectural issue

**Situation:** Bug needs immediate fix, but points to larger problem

**What to do:**

1. Fix bug directly (Level 3) to unblock
2. Write ADR for proper architectural solution
3. Create OpenSpec for refactoring
4. Implement long-term fix

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

### 1. Creating and Accepting an ADR

```bash
# 1. Copy the template
cp docs/architecture/decisions/ADR-0000-template.md \
   docs/architecture/decisions/ADR-NNNN-descriptive-title.md

# 2. Fill in the template (Status: Proposed)
# - Context: Why is this decision needed?
# - Decision: What are we choosing?
# - Alternatives: What else did we consider?
# - Consequences: What are the impacts?

# 3. Review and discuss
# - Share for team review (or self-review)
# - Gather feedback
# - Update based on discussion

# 4. Make the decision and mark as Accepted
# - Update Status: "Proposed" → "Accepted"
# - Add decision date
# - Update INDEX.md (move from Proposed to Accepted section)

# IMPORTANT: Do this BEFORE creating OpenSpec proposal

# 5. [If implementation needed] Create OpenSpec
# - Reference the Accepted ADR in proposal.md
# - Create tasks.md and spec deltas
# - Implement

# 6. Update project conventions (if applicable)
# - Update openspec/project.md to reference the ADR
```

**Key Point:** Mark ADR as "Accepted" when the decision is made, NOT when implementation is done. OpenSpec proposals should only reference Accepted ADRs.

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

**Accepted:** Decision approved and in effect (happens BEFORE implementation starts)

**Deprecated:** No longer recommended but not replaced

**Superseded:** Replaced by a newer ADR

### Important: When to Mark as "Accepted"

**Mark ADR as "Accepted" when:**

- The strategic decision has been made
- Alternatives have been reviewed
- Rationale is documented
- Ready to proceed with implementation

**Do NOT wait for:**

- ❌ Implementation to be complete
- ❌ Code to be written
- ❌ OpenSpec to be finished

**Why:** OpenSpec proposals should reference "Accepted" ADRs, not "Proposed" ones. This ensures you don't plan implementation based on unapproved decisions.

**Sequence:**

1. Write ADR (Status: Proposed)
2. Review and decide
3. **Mark as Accepted** ← Do this BEFORE creating OpenSpec
4. Create OpenSpec (if implementation needed)
5. Implement

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
