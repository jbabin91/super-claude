# Proposal: Add Design System Plugin

## Why

Frontend developers need consistent, accessible UI component generation with modern tooling (Base UI, Storybook, Vitest). Manual scaffolding leads to inconsistent patterns, missing tests, and accessibility issues. A dedicated design-system plugin provides battle-tested patterns for component development.

## What Changes

Add `plugins/design-system/` with three Tier 1 skills:

1. **component-generator** - Generate Base UI components with tests
   - Three-file structure (component.tsx, component.stories.tsx, index.ts)
   - Base UI primitives from @base-ui-components/react
   - Explicit exports (no barrel exports)
   - WCAG AAA accessibility patterns
   - Inline Vitest tests in stories files

2. **design-system-orchestrator** - Design system management
   - Tailwind + Base UI theming
   - Design token management
   - WCAG AAA validation
   - Ripple effect analysis for theme changes

3. **radix-to-baseui-migrator** - Migration support
   - Understand existing Radix UI patterns
   - Suggest Base UI alternatives
   - Provide migration paths

## Impact

**Affected specs:**

- `specs/design-system/` - New plugin capability

**Affected code:**

- `plugins/design-system/` - Plugin directory (already exists)
- `plugins/design-system/skills/component-generator/SKILL.md`
- `plugins/design-system/skills/design-system-orchestrator/SKILL.md`
- `plugins/design-system/skills/radix-to-baseui-migrator/SKILL.md`
- `.claude-plugin/marketplace.json` - Design-system plugin already registered

**Related docs:**

- `supporting/rationale.md` - Tier 1 priority, skill details, design philosophy
- `README.md` - Installation examples

**Note**: Based on archived components-plugin proposal (renamed during marketplace scaffolding). See `openspec/changes/archive/2025-11-06-components-plugin/` for original planning context.
