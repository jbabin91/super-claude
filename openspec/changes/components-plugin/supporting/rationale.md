# Components Plugin Rationale

**Date:** 2025-10-22 (original brainstorm)
**Priority:** 🔴 Tier 1 - Build First

## Why Components First

Component generation and design system management are the most frequent development tasks. These skills solve daily pain points and have the highest ROI.

### Tech Stack Context

**UI Primitives:**

- Current: Radix UI (shadcn)
- Migrating to: Base UI (coss.com)
- Philosophy: [components.build](https://www.components.build/)

**Styling:**

- Tailwind CSS
- cva for variants
- Design tokens for theming

**Documentation:**

- Storybook for component documentation
- Vitest for component testing
- WCAG AAA accessibility

## Skills Breakdown

### 1. component-generator

Generate React components following best practices.

**Features:**

- **Modes:**
  - Quick: `component-name.tsx` only
  - Full: Directory with `component-name.tsx`, `component-name.test.tsx`, `index.ts`, `component-name.stories.tsx`
- **Registry Detection:**
  - shadcn CLI (Radix UI-based)
  - coss.com CLI (Base UI-based)
- **Auto-detect:**
  - Storybook presence (package.json check)
  - Vitest setup
  - Testing library version
- **Generation:**
  - TypeScript props interface
  - Component variants (using cva or similar)
  - Accessibility attributes (aria-\*, role)
  - Test file with user-event patterns
  - Storybook story with args/controls
- **Philosophy:** Follow components.build principles
  - Composable primitives
  - Unstyled base → styled variants
  - Accessibility-first

**Example Usage:**

```txt
"Create a Button component with primary/secondary variants"

Quick mode → components/ui/button.tsx
Full mode → components/ui/button/
  - button.tsx
  - button.test.tsx
  - button.stories.tsx
  - index.ts
```

**Integration Points:**

- TanStack Form (form field components)
- Tailwind (utility classes for variants)
- Base UI or Radix UI (primitive detection)

### 2. design-system-orchestrator

Holistic theme and design token management.

**Features:**

- **Tailwind Config:**
  - Theme customization
  - Custom utility generation
  - Plugin configuration
- **Design Tokens:**
  - Color system (primary, secondary, accent, neutral)
  - Typography scale
  - Spacing scale
  - Border radius, shadows
- **Component Variants:**
  - cva setup for variants
  - Shared variant patterns
  - Token → component mapping
- **WCAG Validation:**
  - Contrast ratio checking (AAA preferred, AA minimum)
  - Color blindness simulation
  - Text readability
- **Ripple Effect Analysis:**
  - "Changing primary color affects: Button, Link, Input, Badge, Alert..."
  - Preview impact across component library
  - Storybook integration for visual verification
- **Theme Switching:**
  - Light/dark mode setup
  - Custom theme generation

**Example Usage:**

```txt
"Change primary color to blue-600 and validate"

1. Update Tailwind config
2. Check WCAG AAA contrast
3. Identify 23 affected components
4. Generate Storybook preview
5. Warn about Button hover state contrast issue
```

**Integration Points:**

- Tailwind CSS
- Storybook (visual verification)
- shadcn/coss.com theming
- Accessibility testing

### 3. radix-to-baseui-migrator

Migrate components from Radix UI to Base UI.

**Features:**

- **Analysis:**
  - Scan project for Radix UI imports
  - Identify component usage patterns
  - Generate migration checklist
- **Component Mapping:**
  - Radix Accordion → Base UI Accordion
  - Radix Dialog → Base UI Dialog
  - Map props differences
- **Migration:**
  - Update imports
  - Transform prop names/values
  - Preserve styling/theming
  - Update tests
- **Validation:**
  - Verify tests still pass
  - Check accessibility (no regressions)
  - Visual regression testing prompts

**Example Usage:**

```txt
"Migrate Accordion component from Radix to Base UI"

1. Analyze current usage
2. Show prop differences
3. Generate migration code
4. Update tests
5. Verify accessibility
```

**Integration Points:**

- coss.com registry
- Storybook (visual verification)
- Vitest (test updates)

## Integration Patterns

### Base UI + Tailwind

- Unstyled primitives
- Utility class styling
- Custom variant system

### Vitest + Storybook

- Component testing
- Visual documentation
- Interaction testing

## Estimated Impact

**Time Saved:** 10-20 hours per week
**Why:** Component generation is daily work, design system changes are frequent

## Related Tools

- **tanstack-wizard** - Forms and tables use components
- **vitest-component-tester** - Automated component testing
- **storybook-automator** - Story generation

## Migration Urgency

**Radix → Base UI Migration:**

- Priority: Tier 2 (Build Soon)
- Status: Exploring Base UI
- Timeline: Next quarter
- Strategy: Gradual adoption, migrator helps when ready

## Design Philosophy

**components.build Principles:**

1. Composable primitives over monolithic components
2. Unstyled base → styled variants
3. Accessibility-first (WCAG AAA target)
4. Type-safe props and variants
5. Documentation-driven development (Storybook)
