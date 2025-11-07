# Proposal: Adapt iannuttall/claude-agents

## Why

The iannuttall/claude-agents repository (1.9k stars, MIT license) provides high-quality, production-ready agents that fill capability gaps in super-claude. After comprehensive research, three agents are recommended for adaptation:

1. **security-auditor** - Fills critical security audit capability gap
2. **frontend-designer** - Complements design-system plugin (mockup → spec workflow)
3. **code-refactorer** - Enhances typescript plugin with systematic refactoring

**Quality assessment:** ⭐⭐⭐⭐ (4/5)

- Professional structure and documentation
- Clear boundaries and methodologies
- Actionable deliverables
- Consistent patterns

**Adaptation needs:**

- Update YAML frontmatter (add version, triggers, category, tags, model)
- Add super-claude tech stack specifics (TanStack, Hono, Base UI, better-auth, Drizzle)
- Apply progressive disclosure where needed
- Convert formats (agent → skill where appropriate)

## What Changes

### 1. security-auditor → plugins/security/

**New plugin:** `plugins/security/`

**Agent:** `plugins/security/agents/security-auditor.md`

- Comprehensive OWASP/CWE vulnerability scanning
- 90+ security checks across 9 categories
- Custom super-claude additions:
  - TanStack Router security (route guards, auth)
  - TanStack Query security (cache poisoning)
  - Hono API security (middleware, CORS, rate limiting)
  - better-auth security (session, tokens, validation)
  - Drizzle ORM security (injection, sanitization)
  - Base UI accessibility security (ARIA)
  - Bun-specific dependency checks
  - GitHub Actions CI/CD security

**Progressive disclosure:**

- `security-auditor.md` - 70-80 lines (core process)
- `API_REFERENCE.md` - 150 lines (vulnerability checklists)
- `EXAMPLES.md` - 100 lines (TanStack/Hono scenarios)
- `TECH_STACK.md` - 80 lines (super-claude specifics)

**Original:** 192 lines (compliant with ADR-0009)

### 2. frontend-designer → design-spec-generator

**Location:** `plugins/design-system/agents/design-spec-generator.md`

**Purpose:** Convert mockups/wireframes/Figma to technical specifications

**Workflow:**

```txt
Mockup → [design-spec-generator] → frontend-design-spec.md → [component-generator] → Components
```

**Adaptations:**

- Rename: frontend-designer → design-spec-generator (clarity of purpose)
- Update tech stack defaults (TanStack Start, Base UI, Tailwind)
- Add Base UI integration guidance
- Reference component-generator for implementation
- Update deliverable template with super-claude workflow
- Emphasize WCAG AAA compliance
- Add explicit exports guidance

**Original:** 193 lines (compliant with ADR-0009)

### 3. code-refactorer → plugins/typescript/

**Location:** `plugins/typescript/skills/code-refactorer/SKILL.md`

**Purpose:** Systematic code quality improvements without changing functionality

**6-phase methodology:**

1. Initial assessment
2. Goal clarification
3. Systematic analysis
4. Refactoring proposals (before/after with WHY)
5. Best practices preservation
6. Strict boundaries (no feature additions)

**Adaptations:**

- Convert agent → skill format
- Add TypeScript/React specific patterns
- Add Base UI component refactoring patterns
- Add TanStack ecosystem patterns
- Reference ADR-0005 (No Barrel Exports)
- Add import/export refactoring guidance
- Add auto-activation triggers

**Original:** 50 lines (compliant with ADR-0009)

## Impact

**New capabilities:**

- Security auditing (OWASP/CWE coverage)
- Design mockup → technical spec workflow
- Systematic code refactoring

**Affected specs:**

- `specs/security/` - New security plugin capability
- `specs/design-system/` - Add design-spec-generator agent
- `specs/typescript/` - Add code-refactorer skill

**Affected code:**

- `plugins/security/` - New plugin directory
- `plugins/security/agents/security-auditor.md`
- `plugins/security/docs/` - API_REFERENCE.md, EXAMPLES.md, TECH_STACK.md
- `plugins/design-system/agents/design-spec-generator.md`
- `plugins/typescript/skills/code-refactorer/SKILL.md`
- `plugins/typescript/.claude-plugin/skill-rules.json` - Add code-refactorer triggers
- `.claude-plugin/marketplace.json` - Add security plugin registration

**Related ADRs:**

- [ADR-0009: Token-Efficient Skill Design](../../docs/architecture/decisions/ADR-0009-token-efficient-skill-design.md) - Progressive disclosure
- [ADR-0005: No Barrel Exports](../../docs/architecture/decisions/ADR-0005-no-barrel-exports.md) - Code refactoring patterns

**Attribution:**
All agents adapted from iannuttall/claude-agents (MIT license)

- Author: Ian Nuttall
- Source: <https://github.com/iannuttall/claude-agents>
- License: MIT
- Adapted: Enhanced with super-claude patterns and tech stack

**Benefits:**

- Fills 3 capability gaps (security, design specs, refactoring)
- Leverages community-validated patterns (1.9k stars)
- Maintains MIT license compatibility
- Proper attribution to original author
