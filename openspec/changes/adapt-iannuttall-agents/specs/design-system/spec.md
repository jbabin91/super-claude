# Design System Plugin Spec Deltas

## ADDED Requirements

### Requirement: Design Specification Generation

The design-system plugin SHALL provide an agent that converts design artifacts into technical specifications.

#### Scenario: Mockup to specification

- **WHEN** user provides design mockup or wireframe
- **THEN** design-spec-generator agent activates
- **AND** analyzes visual design elements
- **AND** extracts design tokens (colors, typography, spacing)
- **AND** generates frontend-design-spec.md

#### Scenario: Figma integration

- **WHEN** user provides Figma file or link
- **THEN** agent analyzes Figma design
- **AND** extracts component hierarchy
- **AND** documents design system foundations
- **AND** creates implementation-ready specifications

#### Scenario: Base UI focus

- **WHEN** generating component specifications
- **THEN** agent specifies Base UI primitives
- **AND** recommends @base-ui-components/react implementations
- **AND** provides Tailwind styling guidance
- **AND** ensures WCAG AAA compliance

### Requirement: Design-to-Code Workflow

The design-system plugin SHALL integrate design-spec-generator with component-generator for complete workflow.

#### Scenario: Specification to implementation

- **WHEN** frontend-design-spec.md is complete
- **THEN** user can reference spec when using component-generator
- **AND** component-generator implements spec with Base UI
- **AND** generates .tsx, .stories.tsx, and index.ts files
- **AND** follows WCAG AAA accessibility requirements

#### Scenario: Workflow documentation

- **WHEN** design-spec-generator completes specification
- **THEN** deliverable includes "Next Steps" section
- **AND** references component-generator skill
- **AND** explains super-claude implementation workflow
- **AND** provides integration guidance

### Requirement: Tech Stack Alignment

The design-spec-generator SHALL default to super-claude's preferred tech stack.

#### Scenario: Tech stack discovery

- **WHEN** design-spec-generator starts discovery phase
- **THEN** defaults to TanStack Start for framework
- **AND** defaults to Base UI for component library
- **AND** defaults to Tailwind CSS for styling
- **AND** defaults to Vitest + Storybook for testing

#### Scenario: Accessibility standards

- **WHEN** generating component specifications
- **THEN** agent targets WCAG AAA compliance
- **AND** specifies ARIA attributes
- **AND** documents keyboard navigation requirements
- **AND** specifies screen reader support

### Requirement: Agent Naming Clarity

The agent SHALL be named design-spec-generator (not frontend-designer) for workflow clarity.

#### Scenario: Naming consistency

- **WHEN** user invokes agent
- **THEN** agent identifies as "design-spec-generator"
- **AND** YAML frontmatter uses name: design-spec-generator
- **AND** documentation references design-spec-generator
- **AND** distinguishes design planning from code generation

#### Scenario: Trigger clarity

- **WHEN** user mentions mockup, wireframe, or Figma
- **THEN** design-spec-generator is suggested
- **AND** distinguishes from component-generator (implementation)
- **AND** clarifies planning vs coding phases

### Requirement: Attribution and Licensing

The design-spec-generator SHALL properly attribute original work and maintain license compliance.

#### Scenario: Attribution present

- **WHEN** design-spec-generator agent is used
- **THEN** YAML frontmatter includes attribution section
- **AND** credits Ian Nuttall as original author (frontend-designer)
- **AND** references iannuttall/claude-agents repository
- **AND** notes MIT license
- **AND** indicates renaming and super-claude adaptations
