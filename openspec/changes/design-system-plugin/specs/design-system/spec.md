# Design System Plugin Specification

## ADDED Requirements

### Requirement: Plugin Structure

The design-system plugin SHALL contain three skills for UI component development.

#### Scenario: Plugin installation

- **WHEN** user installs design-system plugin
- **THEN** make available:
  - component-generator skill
  - design-system-orchestrator skill
  - radix-to-baseui-migrator skill

### Requirement: Three-File Component Structure

The component-generator skill SHALL generate components with exactly three files:

- `<name>/<name>.tsx` - Component implementation
- `<name>/<name>.stories.tsx` - Storybook stories with Vitest tests
- `<name>/index.ts` - Explicit exports only

#### Scenario: Button component generation

- **WHEN** user requests "create a button component"
- **THEN** generate `button/button.tsx`, `button/button.stories.tsx`, `button/index.ts`
- **AND** place in `src/components/ui/button/` directory

### Requirement: Base UI Integration

The component-generator skill SHALL use Base UI primitives from `@base-ui-components/react`.

#### Scenario: Base UI import

- **WHEN** generating any component
- **THEN** import from `@base-ui-components/react` (single package)
- **AND** NOT from individual packages like `@base-ui/button`

#### Scenario: Package dependency check

- **WHEN** generating a component
- **AND** `@base-ui-components/react` not in package.json
- **THEN** prompt to add the package

### Requirement: Explicit Exports Only

The component-generator skill SHALL generate index.ts with explicit named exports.

#### Scenario: Explicit export generation

- **WHEN** generating button component
- **THEN** index.ts contains:

  ```typescript
  export { Button } from './button';
  export type { ButtonProps } from './button';
  ```

- **AND** NOT `export * from './button'`

### Requirement: Storybook Stories with Inline Tests

The component-generator skill SHALL generate .stories.tsx files with both stories AND Vitest tests.

#### Scenario: Stories file structure

- **WHEN** generating any component
- **THEN** .stories.tsx contains:
  - Storybook meta export
  - At least 3 story variants (Default, Disabled, states)
  - Vitest test block with `@vitest-environment jsdom`

#### Scenario: Inline Vitest tests

- **WHEN** generating stories file
- **THEN** include tests:

  ```typescript
  // @vitest-environment jsdom
  import { describe, it, expect } from 'vitest'
  import { render, screen } from '@testing-library/react'

  describe('Button', () => {
    it('renders children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })
  })
  ```

### Requirement: WCAG AAA Accessibility

The component-generator skill SHALL include WCAG AAA accessibility patterns.

#### Scenario: ARIA attributes

- **WHEN** generating interactive components
- **THEN** include:
  - `aria-label` or `aria-labelledby`
  - `role` if semantic HTML insufficient
  - `aria-disabled` for disabled states

#### Scenario: Keyboard navigation

- **WHEN** generating interactive components
- **THEN** include:
  - `onKeyDown` for Enter/Space
  - Focus management
  - `tabIndex` management

#### Scenario: Accessibility testing

- **WHEN** generating stories
- **THEN** include axe-core test:

  ```typescript
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  ```

### Requirement: Design System Management

The design-system-orchestrator skill SHALL manage Tailwind + Base UI theming.

#### Scenario: Theme configuration

- **WHEN** user requests theme setup
- **THEN** generate tailwind.config.js with:
  - Base UI plugin integration
  - Custom design tokens
  - Color palette
  - Typography scale

#### Scenario: Design token organization

- **WHEN** managing design tokens
- **THEN** organize as:
  - colors/ (semantic color tokens)
  - spacing/ (spacing scale)
  - typography/ (font families, sizes, weights)
  - shadows/ (elevation system)

### Requirement: WCAG AAA Color Validation

The design-system-orchestrator skill SHALL validate color contrast ratios.

#### Scenario: Color contrast check

- **WHEN** defining color combinations
- **THEN** validate contrast ratio ≥ 7:1 for normal text
- **AND** ≥ 4.5:1 for large text (18pt+ or 14pt+ bold)

#### Scenario: Failed validation

- **WHEN** color combination fails WCAG AAA
- **THEN** warn user with actual contrast ratio
- **AND** suggest adjusted colors that pass

### Requirement: Theme Change Ripple Analysis

The design-system-orchestrator skill SHALL analyze impact of theme changes.

#### Scenario: Token change analysis

- **WHEN** user modifies a design token
- **THEN** identify all components using that token
- **AND** warn if change breaks accessibility
- **AND** list affected component files

### Requirement: Radix UI Pattern Recognition

The radix-to-baseui-migrator skill SHALL understand existing Radix UI code.

#### Scenario: Radix component detection

- **WHEN** analyzing codebase
- **THEN** detect Radix UI imports:
  - `import * as Dialog from '@radix-ui/react-dialog'`
  - Individual package imports
  - Composite components

#### Scenario: Radix pattern understanding

- **WHEN** user asks about Radix component
- **THEN** explain current implementation
- **AND** identify Radix-specific patterns (Root, Trigger, Portal, etc.)

### Requirement: Base UI Alternative Suggestions

The radix-to-baseui-migrator skill SHALL suggest Base UI equivalents.

#### Scenario: Dialog migration suggestion

- **WHEN** detecting Radix Dialog
- **THEN** suggest Base UI Dialog alternative
- **AND** provide side-by-side comparison
- **AND** explain API differences

#### Scenario: No Base UI equivalent

- **WHEN** Radix component has no Base UI equivalent
- **THEN** suggest semantic HTML alternative
- **OR** suggest keeping Radix for that component
- **AND** explain reasoning

### Requirement: Migration Path Guidance

The radix-to-baseui-migrator skill SHALL provide step-by-step migration guides.

#### Scenario: Component migration steps

- **WHEN** user requests migration for a component
- **THEN** provide steps:
  1. Install @base-ui-components/react
  2. Import changes needed
  3. API changes needed
  4. Styling adjustments needed
  5. Testing checklist

#### Scenario: Incremental migration

- **WHEN** codebase has many Radix components
- **THEN** suggest incremental approach
- **AND** prioritize components by:
  - Most frequently changed
  - Simplest to migrate
  - Highest user impact

### Requirement: Component Name Detection

The component-generator skill SHALL detect component names from context.

#### Scenario: Implicit name detection

- **WHEN** user says "create a button component"
- **THEN** extract name "Button"
- **AND** use PascalCase in code, kebab-case in filenames

### Requirement: Directory Structure Convention

The component-generator skill SHALL place components in `src/components/ui/<name>/` by default.

#### Scenario: Default location

- **WHEN** generating component without path specified
- **THEN** create in `src/components/ui/<name>/`

#### Scenario: Custom location

- **WHEN** user specifies custom path
- **THEN** use that path instead
- **AND** maintain three-file structure

#### Scenario: Missing directory

- **WHEN** target directory doesn't exist
- **THEN** create directory structure
- **OR** ask user for preferred location
