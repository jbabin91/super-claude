# Super-Claude Brainstorm Session

**Date:** October 22, 2025
**Purpose:** Identify skills, agents, commands, and hooks based on current tech stack

## 📚 Tech Stack Context

### Frontend

- **Framework:** React + Vite
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query
- **Tables:** TanStack Table
- **Forms:** TanStack Form
- **UI Primitives:**
  - Current: Radix UI (shadcn)
  - Migrating to: Base UI (coss.com)
  - Philosophy: [components.build](https://www.components.build/)
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Playwright
- **Documentation:** Storybook
- **Type Safety:** TypeScript

### Backend

- **Frameworks:** Hono, Elysia
- **API Patterns:** OpenAPI + RPC
- **Database:** Drizzle ORM + PostgreSQL (also Turso/SQLite)
- **Auth:** better-auth

### Fullstack

- **Meta-framework:** TanStack Start
- **Server Functions:** Built-in TanStack Start routes

### Tooling & Quality

- **Formatting:** Prettier
- **Linting:** ESLint (exploring oxlint/oxfmt)
- **Git Hooks:** Husky, lint-staged, lefthook
- **Markdown:** markdownlint-cli2
- **Validation:** Zod (primary), ArkType (exploring)
- **Not using:** Biome (too limited vs ESLint ecosystem)

### Monorepo

- **Package Manager:** pnpm workspaces
- **Build System:** Turborepo

### Documentation

- **Framework:** Astro Starlight

### Emerging Interests

- **Local-First:** Zero Sync, TanStack DB, ElectricSQL
- **Modern Tooling:** oxlint, oxfmt, ArkType

## 🎯 Skills

### Frontend Tools Plugin

#### 1. component-generator

**Priority:** 🔴 Tier 1 (Build First)

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

---

#### 2. radix-to-baseui-migrator

**Priority:** 🟡 Tier 2 (Build Soon)

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

---

#### 3. tanstack-wizard

**Priority:** 🔴 Tier 1 (Build First)

Setup and integration helper for TanStack suite.

**Features:**

- **TanStack Router:**
  - File-based routing setup
  - Route type generation
  - Loader patterns
  - Navigation helpers
- **TanStack Query:**
  - QueryClient configuration
  - DevTools setup
  - Query hook generation from API types
  - Optimistic update patterns
  - Cache management strategies
- **TanStack Table:**
  - Column definitions from TypeScript types
  - Filtering, sorting, pagination
  - Server-side vs client-side patterns
- **TanStack Form:**
  - Zod schema integration
  - Field validation patterns
  - Multi-step form setup
  - Optimistic updates with Query
- **Cross-Integration:**
  - Router + Query (data preloading)
  - Form + Query (mutations)
  - Table + Query (server pagination)

**Example Usage:**

```txt
"Setup TanStack Query with user API"

1. Configure QueryClient
2. Generate useUsers() hook
3. Add DevTools
4. Create mutation hooks
5. Setup optimistic updates
```

**Integration Points:**

- Zod (form validation)
- Hono/Elysia RPC (type-safe queries)
- TypeScript (type generation)

---

#### 4. design-system-orchestrator

**Priority:** 🔴 Tier 1 (Build First)

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

---

### Testing Tools Plugin

#### 5. vitest-component-tester

**Priority:** 🟡 Tier 2 (Build Soon)

Generate and optimize component tests.

**Features:**

- **Test Generation:**
  - Component rendering tests
  - Props variations
  - User interaction patterns
  - Accessibility tests (jest-axe)
- **TanStack Query Integration:**
  - QueryClient wrapper setup
  - Mock server state
  - Optimistic update testing
- **Patterns:**
  - User event testing (click, type, submit)
  - Async operations
  - Error boundary testing
- **Coverage Analysis:**
  - Identify untested branches
  - Generate missing tests
  - Coverage gap reporting

**Example Usage:**

```txt
"Generate tests for UserProfile component"

1. Render test
2. Props variation tests
3. User interactions (edit profile)
4. TanStack Query mock (useUser hook)
5. Accessibility test
6. Coverage: 94% (missing error state)
```

**Integration Points:**

- Vitest
- Testing Library
- TanStack Query
- jest-axe

---

#### 6. playwright-e2e-generator

**Priority:** 🔵 Tier 3 (Quality of Life)

End-to-end test generation for user flows.

**Features:**

- **Page Object Model:**
  - Generate POM from routes
  - TanStack Router awareness
- **Test Scenarios:**
  - User authentication flows
  - Form submissions
  - Multi-step wizards
  - Error handling
- **Network Mocking:**
  - Mock TanStack Query endpoints
  - Response variations (success, error, loading)
- **Visual Regression:**
  - Screenshot comparison
  - Component visual testing
- **Accessibility Audit:**
  - Automated a11y checks
  - WCAG compliance reporting

**Example Usage:**

```txt
"Create E2E test for user registration"

1. Navigate to /register
2. Fill form fields
3. Submit with validation
4. Handle success/error states
5. Verify redirect to /dashboard
6. Check accessibility
```

**Integration Points:**

- Playwright
- TanStack Router
- TanStack Query
- Accessibility auditing

---

#### 7. storybook-automator

**Priority:** 🔵 Tier 3 (Quality of Life)

Automate Storybook story generation.

**Features:**

- **Story Generation:**
  - Auto-generate from component props
  - Args/controls from TypeScript types
  - Variants coverage (all states)
- **Interaction Testing:**
  - User interaction scenarios
  - Form validation testing
- **Accessibility:**
  - a11y addon integration
  - Contrast checking
  - Keyboard navigation testing
- **Documentation:**
  - Auto-generated prop tables
  - Usage examples
  - Design guidelines

**Example Usage:**

```txt
"Generate stories for Button component"

1. Default story
2. Variant stories (primary, secondary, ghost)
3. Size stories (sm, md, lg)
4. State stories (disabled, loading)
5. Interaction tests (onClick)
6. Accessibility checks
```

**Integration Points:**

- Storybook
- TypeScript
- a11y addon

---

### TypeScript Tools Plugin

#### 8. schema-validator

**Priority:** 🔵 Tier 3 (Quality of Life)

Zod and ArkType schema management.

**Features:**

- **Schema Generation:**
  - From TypeScript types → Zod/ArkType
  - From API responses → validation schemas
  - From database models → form schemas
- **Migration:**
  - Zod ↔ ArkType conversion
  - Performance comparison
  - Feature parity checking
- **Integration Patterns:**
  - TanStack Form + Zod
  - API validation (Hono/Elysia)
  - Environment variable validation
- **Validation:**
  - Runtime validation helpers
  - Error message customization
  - Refinement patterns

**Example Usage:**

```txt
"Create Zod schema from User type"

type User = {
  id: string;
  email: string;
  age?: number;
}

→ const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().int().positive().optional()
})
```

**Integration Points:**

- Zod, ArkType
- TanStack Form
- Hono/Elysia validation
- Drizzle ORM

---

#### 9. oxlint-explorer

**Priority:** 🟣 Tier 4 (Exploration)

Explore migration from ESLint to oxlint.

**Features:**

- **Comparison:**
  - Performance benchmarks
  - Rule coverage comparison
  - Plugin compatibility matrix
- **Migration:**
  - ESLint config → oxlint config
  - Identify unsupported rules
  - Gradual adoption strategy
- **Analysis:**
  - Speed improvements
  - Trade-offs (features vs performance)
  - Recommendation based on project

**Example Usage:**

```txt
"Compare ESLint vs oxlint for this project"

1. Run benchmark (ESLint: 2.3s, oxlint: 0.3s)
2. Check rule coverage (95% compatible)
3. Missing: react-hooks/exhaustive-deps
4. Recommendation: Gradual adoption, keep ESLint for complex rules
```

---

#### 10. quality-enforcer

**Priority:** 🟡 Tier 2 (Build Soon)

Setup quality tooling and git hooks.

**Features:**

- **Tool Selection:**
  - Husky vs lefthook (user choice)
  - lint-staged configuration
  - markdownlint-cli2 setup
- **ESLint + Prettier:**
  - Config templates
  - Plugin recommendations
  - Integration setup
- **Git Hooks:**
  - pre-commit: type-check, lint, format, test affected
  - pre-push: full test suite
  - commit-msg: conventional commits
- **CI/CD:**
  - GitHub Actions workflow templates
  - Quality gates

**Example Usage:**

```txt
"Setup quality tooling with lefthook"

1. Install lefthook
2. Configure lint-staged
3. Setup pre-commit: prettier, eslint, tsc
4. Setup pre-push: vitest
5. Add commit-msg: conventional commits
```

**Integration Points:**

- lefthook/husky
- lint-staged
- ESLint, Prettier
- Vitest, TypeScript

---

### Backend Tools Plugin (NEW)

#### 11. hono-api-builder

**Priority:** 🔴 Tier 1 (Build First)

Hono API development helper.

**Features:**

- **Route Generation:**
  - OpenAPI decorator patterns
  - Zod validation integration
  - Type-safe route handlers
- **RPC Setup:**
  - Hono RPC client/server
  - End-to-end type safety
  - Client generation
- **Middleware:**
  - Auth middleware (better-auth integration)
  - CORS, logging, error handling
  - Request validation
- **OpenAPI:**
  - Spec generation from routes
  - Swagger UI integration
  - Type generation from spec

**Example Usage:**

```txt
"Create /users GET endpoint"

1. Generate route with OpenAPI decorators
2. Add Zod validation
3. Create RPC client type
4. Add auth middleware
5. Update OpenAPI spec
```

**Integration Points:**

- Hono
- Zod
- better-auth
- Drizzle ORM
- OpenAPI

---

#### 12. elysia-api-builder

**Priority:** 🔴 Tier 1 (Build First)

Elysia API development helper (alternative to Hono).

**Features:**

- **Route Generation:**
  - Elysia decorator patterns
  - Schema validation (Zod/ArkType)
  - Type-safe handlers
- **Eden RPC:**
  - Eden client setup
  - Type safety across client/server
- **Plugins:**
  - Auth plugin integration
  - Swagger plugin
  - CORS plugin
- **OpenAPI:**
  - Auto-generated docs
  - Type generation

**Example Usage:**

```txt
"Create /posts API with Eden RPC"

1. Define routes with Elysia
2. Add schema validation
3. Generate Eden client
4. Setup Swagger docs
5. Add authentication
```

**Integration Points:**

- Elysia
- Eden RPC
- Zod/ArkType
- better-auth
- Drizzle ORM

---

#### 13. drizzle-maestro

**Priority:** 🔴 Tier 1 (Build First)

Drizzle ORM development helper.

**Features:**

- **Schema Management:**
  - Generate from TypeScript types
  - Relation builder (one-to-many, many-to-many)
  - Index and constraint helpers
- **Migrations:**
  - Migration creation
  - Migration safety checks
  - Rollback strategies
  - Seed data management
- **Query Helpers:**
  - Common query patterns
  - Type-safe query builder
  - Transaction patterns
- **PostgreSQL Optimization:**
  - Index recommendations
  - Query performance analysis
- **Multi-DB Support:**
  - PostgreSQL (primary)
  - Turso/SQLite variants

**Example Usage:**

```txt
"Create User schema with posts relation"

1. Define users table
2. Define posts table (foreign key to users)
3. Generate one-to-many relation
4. Create migration
5. Generate seed data helper
```

**Integration Points:**

- Drizzle ORM
- PostgreSQL, SQLite, Turso
- better-auth (user tables)
- Zod (schema validation)

---

#### 14. better-auth-integrator

**Priority:** 🔴 Tier 1 (Build First)

better-auth setup and integration.

**Features:**

- **Provider Setup:**
  - Email/password authentication
  - OAuth (Google, GitHub, etc.)
  - Multi-provider configuration
- **Integration:**
  - Hono/Elysia middleware
  - Protected route patterns
  - Session management
- **Database:**
  - Drizzle schema generation
  - User table setup
  - Session storage
- **Frontend:**
  - Auth hooks for React
  - Login/signup components
  - Protected route wrapper

**Example Usage:**

```txt
"Setup better-auth with Google OAuth"

1. Install better-auth
2. Configure Google provider
3. Generate Drizzle schema (users, sessions)
4. Create auth middleware
5. Add login/logout routes
6. Generate React hooks
```

**Integration Points:**

- better-auth
- Drizzle ORM
- Hono/Elysia
- React (auth context)

---

#### 15. local-first-explorer

**Priority:** 🟣 Tier 4 (Exploration)

Explore local-first architectures.

**Features:**

- **Comparison:**
  - Zero Sync vs TanStack DB vs ElectricSQL
  - Feature matrix
  - Performance characteristics
  - Use case fit
- **Architecture Patterns:**
  - Offline-first data layer
  - Sync strategies
  - Conflict resolution
- **Migration Path:**
  - From traditional backend
  - Hybrid approach (some local, some remote)
  - Gradual adoption

**Example Usage:**

```txt
"Compare local-first solutions for todo app"

1. ElectricSQL: PostgreSQL sync, mature, complex setup
2. TanStack DB: Lightweight, TanStack integration, early stage
3. Zero Sync: Replicache-based, good DX, vendor lock-in
4. Recommendation: TanStack DB for TanStack Start integration
```

---

### DevOps Tools Plugin

#### 16. turborepo-architect

**Priority:** 🟡 Tier 2 (Build Soon)

Turborepo monorepo management.

**Features:**

- **Workspace Setup:**
  - Package organization (apps/, packages/)
  - Shared packages (ui, utils, config, types)
  - Dependency management
- **Pipeline Configuration:**
  - Build, test, lint, format tasks
  - Task dependencies
  - Cache configuration
- **Optimization:**
  - Incremental builds
  - Remote caching
  - Parallel execution
- **Dependency Graph:**
  - Visualization
  - Affected package detection
  - Build order optimization

**Example Usage:**

```txt
"Setup Turborepo for fullstack monorepo"

1. Create workspace structure
2. Configure pipeline (build → test)
3. Setup shared packages (@repo/ui, @repo/utils)
4. Optimize cache config
5. Generate dependency graph
```

**Integration Points:**

- Turborepo
- pnpm workspaces
- Vitest, ESLint, TypeScript

---

#### 17. pnpm-workspace-manager

**Priority:** 🟡 Tier 2 (Build Soon)

pnpm workspace management.

**Features:**

- **Workspace Protocol:**
  - workspace:\* setup
  - Cross-package imports
  - Version management
- **Catalog:**
  - Centralized dependency management
  - Version synchronization
- **Scripts:**
  - Workspace-wide scripts
  - Filtered execution
  - Recursive commands
- **Dependencies:**
  - Shared dependencies
  - Package-specific dependencies
  - Hoisting strategies

**Example Usage:**

```txt
"Setup pnpm workspace with catalog"

1. Create pnpm-workspace.yaml
2. Setup catalog for shared deps
3. Configure workspace protocol
4. Add root package.json scripts
5. Setup filtered runs
```

**Integration Points:**

- pnpm
- Turborepo
- TypeScript (path mapping)

---

#### 18. starlight-docs-generator

**Priority:** 🔵 Tier 3 (Quality of Life)

Astro Starlight documentation generation.

**Features:**

- **Site Setup:**
  - Starlight configuration
  - Theme customization
  - Navigation structure
- **Content Generation:**
  - API docs from TypeScript
  - Component docs from Storybook
  - Code examples with syntax highlighting
- **Integration:**
  - Search setup
  - Dark mode
  - Mobile responsive
- **Automation:**
  - Auto-generate nav from structure
  - Update on code changes

**Example Usage:**

```txt
"Generate docs site for component library"

1. Setup Starlight
2. Generate component API docs
3. Import Storybook examples
4. Create navigation
5. Add search
```

**Integration Points:**

- Astro Starlight
- TypeScript (API extraction)
- Storybook (examples)

---

## 🤖 Agents

Agents are specialized Claude instances for complex, multi-step reasoning tasks.

### 1. api-architect-agent

**Priority:** 🟡 Tier 2

Design APIs from requirements.

**Capabilities:**

- Analyze requirements → API design
- Generate OpenAPI specifications
- Type-safe client generation
- API versioning strategies
- Breaking change analysis
- Documentation generation

**Example Task:**

```txt
"Design a blog API with posts, comments, and auth"

1. Analyze entities and relationships
2. Design REST endpoints
3. Design RPC methods
4. Generate OpenAPI spec
5. Create type-safe client
6. Document API patterns
```

---

### 2. component-designer-agent

**Priority:** 🟡 Tier 2

Design component hierarchies and APIs.

**Capabilities:**

- Component composition strategy (components.build philosophy)
- Props API design
- Variant system architecture
- Accessibility planning
- Performance considerations
- Storybook scenario planning

**Example Task:**

```txt
"Design a DataTable component with filtering and sorting"

1. Break down into primitives (Table, Header, Row, Cell)
2. Design props API (columns, data, filters)
3. Plan variant system (density, borders)
4. Ensure accessibility (roles, keyboard nav)
5. Optimize rendering (virtualization?)
6. Create Storybook scenarios
```

---

### 3. migration-strategist-agent

**Priority:** 🟡 Tier 2

Plan complex migrations.

**Capabilities:**

- Risk analysis
- Step-by-step migration plans
- Rollback strategies
- Testing coverage requirements
- Gradual adoption paths
- Breaking change management

**Example Task:**

```txt
"Plan migration from Radix UI to Base UI"

1. Audit all Radix components (15 found)
2. Risk assessment (medium - well-tested)
3. Migration order (primitives first, complex last)
4. Per-component strategy
5. Testing requirements (visual regression, a11y)
6. Rollback plan (feature flags)
7. Timeline estimate (2-3 weeks)
```

---

### 4. performance-optimizer-agent

**Priority:** 🔵 Tier 3

Optimize application performance.

**Capabilities:**

- Bundle analysis
- Code splitting strategies
- React rendering optimization
- TanStack Query caching
- Database query optimization
- Lighthouse score improvement

**Example Task:**

```txt
"Optimize bundle size for production"

1. Analyze bundle (webpack-bundle-analyzer)
2. Identify large dependencies
3. Implement code splitting
4. Lazy load routes
5. Optimize TanStack Query prefetching
6. Measure improvement (40% reduction)
```

---

## ⚡ Commands

Commands are quick, frequently-used workflows.

### 1. /scaffold-component

**Priority:** 🔴 Tier 1

Quick component creation.

**Workflow:**

```txt
/scaffold-component Button

Prompts:
- Mode? (quick/full)
- Registry? (shadcn/coss)
- Variants? (primary, secondary, ghost)

Generates:
- components/ui/button/button.tsx
- components/ui/button/button.test.tsx
- components/ui/button/button.stories.tsx
- components/ui/button/index.ts

Updates:
- components/ui/index.ts (barrel export)
```

---

### 2. /setup-tanstack

**Priority:** 🔴 Tier 1

Initialize TanStack suite.

**Workflow:**

```txt
/setup-tanstack

Select:
☑ Router
☑ Query
☐ Table
☑ Form

Generates:
- src/lib/query-client.ts
- src/lib/router.ts
- src/routes/index.tsx
- Installs dependencies
- Configures DevTools
```

---

### 3. /add-auth

**Priority:** 🔴 Tier 1

better-auth integration.

**Workflow:**

```txt
/add-auth

Select providers:
☑ Email/Password
☑ Google
☐ GitHub

Generates:
- auth.ts (config)
- auth routes (/login, /logout, /callback)
- Drizzle schema (users, sessions)
- Auth middleware
- React hooks (useSession, useUser)
- .env.example updates
```

---

### 4. /create-api

**Priority:** 🔴 Tier 1

API endpoint generation.

**Workflow:**

```txt
/create-api GET /users/:id

Framework? Hono

Generates:
- routes/users.ts
- OpenAPI decorators
- Zod validation
- RPC client type
- Test file
Updates:
- openapi.json
```

---

### 5. /init-workspace

**Priority:** 🟡 Tier 2

Monorepo setup.

**Workflow:**

```txt
/init-workspace

Creates:
- pnpm-workspace.yaml
- turbo.json
- packages/ui/
- packages/utils/
- packages/config/
- apps/web/
- apps/api/
Root scripts configured
```

---

### 6. /migrate-radix-baseui

**Priority:** 🟡 Tier 2

Start Radix → Base UI migration.

**Workflow:**

```txt
/migrate-radix-baseui

Scans:
- Found 8 components using Radix

Select component to migrate:
→ Accordion
  Dialog
  DropdownMenu
  ...

Generates:
- Migration code
- Updated tests
- Migration checklist
```

---

### 7. /setup-quality

**Priority:** 🟡 Tier 2

Quality tooling initialization.

**Workflow:**

```txt
/setup-quality

Git hooks? lefthook

Configures:
- lefthook.yaml
- lint-staged
- ESLint + Prettier
- markdownlint-cli2
- Pre-commit hooks
```

---

## 🎣 Hooks

Hooks are event-driven automation for validation and quality gates.

### PreToolUse:Write - Component Validation

**Trigger:** Creating/editing .tsx files in components/

**Actions:**

- Validate naming convention (PascalCase)
- Check if test file should exist
- Warn if no Storybook story (when Storybook detected)
- Validate accessibility attributes

**Example:**

```txt
Creating: components/ui/custom-button.tsx

⚠️ Warning: Component name doesn't match file name
   File: custom-button.tsx
   Component: Button

⚠️ Missing test file: custom-button.test.tsx
   Storybook detected but no story file found

✓ Accessibility: aria-label present
```

---

### PreToolUse:Write - API Route Validation

**Trigger:** Creating/editing files in api/ or routes/

**Actions:**

- Validate OpenAPI decorators present
- Check Zod schema validation
- Ensure error handling middleware
- Validate RPC type safety

**Example:**

```txt
Creating: routes/users.ts

⚠️ Missing OpenAPI decorator on GET /users
⚠️ No Zod validation found
✓ Error handling middleware present
```

---

### PreToolUse:Edit - Theme Change Validation

**Trigger:** Editing Tailwind config or CSS variables

**Actions:**

- Run WCAG contrast checks
- Identify affected components
- Suggest Storybook verification

**Example:**

```txt
Editing: tailwind.config.ts (primary color change)

Running WCAG checks...
⚠️ Contrast issue: primary-500 on white (AA, not AAA)

Affected components (23):
- Button, Link, Badge, Alert, Input, Select...

💡 Tip: Run Storybook to verify visually
```

---

### PreToolUse:Write - Schema Change Detection

**Trigger:** Editing Drizzle schema files

**Actions:**

- Prompt for migration creation
- Validate breaking changes
- Check seed data impact

**Example:**

```txt
Editing: schema/users.ts

⚠️ Schema change detected: added 'role' column

Action required:
1. Generate migration
2. Update seed data
3. Check affected queries
```

---

### UserPromptSubmit - Workspace Context Injection

**Trigger:** User submits prompt

**Actions:**

- Detect monorepo package from cwd
- Inject package-specific context
- Load workspace dependencies

**Example:**

```txt
Working directory: apps/web/

Context injected:
- Package: @repo/web
- Dependencies: @repo/ui, @repo/utils
- Type: Next.js app
```

---

### PreToolUse:Bash - Package Manager Enforcement

**Trigger:** Running npm or yarn commands

**Actions:**

- Block command
- Suggest pnpm equivalent

**Example:**

```txt
$ npm install lodash

❌ Blocked: Use pnpm instead
💡 Run: pnpm add lodash
```

---

### PostToolUse:Write - Auto-formatting

**Trigger:** After creating/editing files

**Actions:**

- Run Prettier
- Run ESLint --fix
- Stage formatted files

**Example:**

```txt
Created: components/ui/button.tsx

Formatting...
✓ Prettier applied
✓ ESLint fixed 2 issues
✓ Staged changes
```

---

### Stop - Quality Checklist

**Trigger:** Claude finishes response

**Actions:**

- Remind about tests if components created
- Remind about OpenAPI docs if API routes created
- Remind about migrations if schema edited

**Example:**

```txt
✅ Created Button component

Checklist:
☐ Write tests (button.test.tsx)
☐ Create story (button.stories.tsx)
☐ Verify accessibility (WCAG AAA)
☐ Update design system docs
```

---

## 📊 Prioritization

### 🔴 Tier 1: Immediate Impact (Build First)

**Why:** These solve daily pain points and have highest ROI.

1. **component-generator** - Most frequent task
2. **tanstack-wizard** - Suite setup is complex
3. **design-system-orchestrator** - Theme work is critical
4. **drizzle-maestro** - Database is foundation
5. **better-auth-integrator** - Auth is common need
6. **hono-api-builder** OR **elysia-api-builder** - API development is frequent

**Estimated Impact:** 10-20 hours saved per week

---

### 🟡 Tier 2: High Value (Build Soon)

**Why:** These improve quality and reduce tech debt.

7. **vitest-component-tester** - Testing discipline
8. **turborepo-architect** - Monorepo is default
9. **pnpm-workspace-manager** - Workspace management
10. **radix-to-baseui-migrator** - Active transition
11. **quality-enforcer** - Prevent issues early
12. **Agents** - Complex reasoning tasks

**Estimated Impact:** 5-10 hours saved per week

---

### 🔵 Tier 3: Quality of Life (Build When Stable)

**Why:** Nice to have, but not blocking.

13. **storybook-automator**
14. **playwright-e2e-generator**
15. **schema-validator**
16. **starlight-docs-generator**
17. **Commands** - Speed up workflows

**Estimated Impact:** 2-5 hours saved per week

---

### 🟣 Tier 4: Exploration (Future)

**Why:** Exploring new tech, not production-ready yet.

18. **local-first-explorer**
19. **oxlint-explorer**
20. **Performance optimization tools**

**Estimated Impact:** Learning and future-proofing

---

## 🔗 Integration Patterns

These cross-tool synergies should be first-class in skills:

### TanStack Query + TanStack Router

- Data preloading on route navigation
- Loader functions with Query
- Prefetching strategies

### TanStack Form + Zod

- Schema-based validation
- Type-safe form state
- Error message generation

### Drizzle + better-auth

- User table integration
- Session storage
- Auth state in database

### Hono/Elysia + Drizzle

- End-to-end type safety
- Query builders in routes
- Transaction patterns

### Base UI + Tailwind

- Unstyled primitives
- Utility class styling
- Custom variant system

### Vitest + Storybook

- Component testing
- Visual documentation
- Interaction testing

---

## ❓ Questions for User

Before building, need clarification on:

### 1. Hono vs Elysia Preference

- **Question:** Which do you use more: Hono or Elysia?
- **Why:** Should we build both or focus on one?
- **Options:**
  - Build Hono first (more mature, larger ecosystem)
  - Build Elysia first (better performance, modern API)
  - Build both (more work, but comprehensive)

### 2. Migration Urgency

- **Question:** How urgent is Radix → Base UI migration?
- **Why:** Affects prioritization of migrator tool
- **Options:**
  - Critical (in progress now) → Tier 1
  - Soon (next month) → Tier 2
  - Future (exploring) → Tier 3

### 3. Monorepo Frequency

- **Question:** How often do you create new monorepos?
- **Why:** Determines priority of workspace tools
- **Options:**
  - Frequently (new projects) → Tier 1
  - Occasionally (once per quarter) → Tier 2
  - Rarely (one-time setup) → Tier 3

### 4. Storybook Importance

- **Question:** How important is Storybook automation vs testing?
- **Why:** Both are Tier 3 currently
- **Options:**
  - Storybook > Testing (design system focus)
  - Testing > Storybook (quality focus)
  - Equal importance

### 5. Testing Strategy

- **Question:** What's your testing priority order?
- **Options:**
  - Unit tests (Vitest) → Integration → E2E (Playwright)
  - E2E first → Integration → Unit
  - Focus on one type initially

---

## 🎯 Recommended First 5 Skills

Based on analysis, start with these:

### 1. component-generator (frontend-tools)

**Rationale:** Daily use, high impact, enables other skills

### 2. tanstack-wizard (frontend-tools)

**Rationale:** Complex suite, saves hours of setup

### 3. drizzle-maestro (backend-tools)

**Rationale:** Database is foundation for all backend work

### 4. hono-api-builder OR elysia-api-builder (backend-tools)

**Rationale:** API development is frequent (choose based on user answer)

### 5. better-auth-integrator (backend-tools)

**Rationale:** Auth is required for most apps

**After these 5:** Get user feedback, measure impact, iterate.

---

## 📝 Next Steps

1. **User Review:** Answer clarification questions above
2. **Prioritize:** Confirm Tier 1 selection
3. **Start OpenSpecs:** Create proposals for first 3-5 skills
4. **Build:** RED-GREEN-REFACTOR for each skill
5. **Test:** Validate in real projects
6. **Iterate:** Based on actual usage patterns

---

## 💡 Additional Thoughts

### Gap: Type Contract Enforcement

Consider adding a skill for:

- Validate API types match frontend expectations
- RPC type alignment
- OpenAPI spec ↔ TypeScript validation
- Prevent type drift

### Gap: Environment Management

Consider adding:

- .env.example generation from actual usage
- Type-safe env validation (T3 Env pattern)
- Monorepo package-specific env

### Gap: Form Patterns

Consider adding:

- Multi-step form wizard
- Optimistic updates with TanStack Query
- Field array management
- Conditional fields

### Emerging: Build Optimization

When performance becomes priority:

- Code splitting for TanStack Router
- Lazy loading patterns
- Bundle analyzer integration
- Vite optimization

---

**Status:** 📋 Ready for Review
**Next:** User clarification on questions above
