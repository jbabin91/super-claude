# Research Findings: Claude Code Skills Ecosystem

> Comprehensive analysis of 11 GitHub repositories containing Claude Code skills, agents, and marketplace patterns.

**Research Date:** 2025-01-21
**Repositories Analyzed:** 11
**Total Skills Cataloged:** 200+

---

## Executive Summary

### Key Findings

1. **No Official Marketplace Exists** - All marketplaces are community-driven via GitHub
2. **Progressive Disclosure = 2.5x Token Savings** - Skills are more efficient than persistent MCP servers
3. **Two Distribution Models:**
   - Plugin-based (context-aware activation, no slash commands)
   - Toolkit libraries (manual integration, Python CLI tools)
4. **Universal Executor Pattern** - Critical for test framework integration (playwright-skill)
5. **obra/superpowers** - Most battle-tested community library (324★, 20+ skills)

---

## Repository Analysis

### 1. obra/superpowers (324★ - Foundation)

**Type:** Plugin system with automatic skill activation
**URL:** <https://github.com/obra/superpowers>

**Structure:**

```sh
.claude-plugin/          # Plugin configuration
skills/                  # Core skill definitions
  ├── testing/          # TDD, async patterns, anti-patterns
  ├── debugging/        # Root cause analysis, verification
  ├── collaboration/    # Planning, code review, agent workflows
  ├── development/      # Git workflows
  └── meta/            # Skill creation guidance
commands/               # Slash command implementations
agents/                 # Agent configurations
hooks/                  # Session lifecycle hooks
```

**Skill Format:**

- YAML frontmatter with rich metadata
- Auto-activation based on conversation context
- No manual commands needed
- SessionStart hooks for automatic loading

**Philosophy:**

- "Write tests first, always" (TDD)
- "Evidence over claims - Verify before declaring success"
- "Process over guessing"

**Top Skills:**

- `test-driven-development` (v3.1.0) - RED-GREEN-REFACTOR cycle
- `systematic-debugging` - 4-phase root cause analysis
- `code-review` - Structured review workflows
- `parallel-agent-dispatch` - Multi-agent coordination
- `condition-based-waiting` - Async testing patterns

**Installation:**

```bash
/plugin marketplace add obra/superpowers
```

---

### 2. obra/superpowers-skills (Community Collection)

**Type:** Community skill repository (auto-cloned by superpowers)
**URL:** <https://github.com/obra/superpowers-skills>
**Stars:** 324★ | **Forks:** 76

**Key Features:**

- 8 skill categories
- Token efficiency targets (<500 words per skill)
- RED-GREEN-REFACTOR development methodology
- Search optimization strategies

**Skill Categories:**

1. Architecture (dependency management, system design)
2. Collaboration (code review, planning)
3. Debugging (root cause analysis)
4. Meta (skill creation, testing)
5. Problem-solving (analytical strategies)
6. Research (investigation techniques)
7. Testing (TDD, anti-patterns, async)
8. Using-skills (usage guides)

**Writing Skills Guide (Meta):**

**YAML Frontmatter:**

```yaml
---
name: Human-Readable Name
description: One-line summary
when_to_use: when [trigger/situation]
version: 5.1.0
languages: all | [specific languages]
dependencies: (optional) Required tools
---
```

**Content Structure:**

```markdown
## Overview

Core principle in 1-2 sentences maximum.

## When to Use

Bullet list with concrete triggers and symptoms.

## Core Pattern / Quick Reference

Before/after comparisons or scannable tables.

## Implementation

Inline code for simple patterns; link to files for heavy reference.

## Common Mistakes

Specific failures + fixes for each.
```

**Token Efficiency Targets:**

- Getting-started: <150 words
- Frequently-loaded: <200 words
- Other skills: <500 words

**RED-GREEN-REFACTOR for Skills:**

1. **RED:** Run scenarios WITHOUT skill, document failures
2. **GREEN:** Write minimal skill, verify compliance
3. **REFACTOR:** Plug rationalizations, re-test

---

### 3. anthropics/skills (11.3k★ - Official)

**Type:** Official Anthropic skill examples
**URL:** <https://github.com/anthropics/skills>

**Skill Categories:**

- Creative & Design (algorithmic-art, canvas-design, theme-factory)
- Development & Technical (artifacts-builder, mcp-builder, webapp-testing)
- Enterprise & Communication (internal-comms)
- Meta Skills (skill-creator, template-skill)
- Document Skills (docx, pdf, pptx, xlsx)

**Skill Format:**

```yaml
---
name: skill-name
description: Complete description of functionality and use cases
---
```

**Minimal frontmatter** compared to community versions - intentionally simple.

**Top Skills:**

**1. artifacts-builder**

- React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- 40+ shadcn components available
- Self-contained HTML output (inlined dependencies)
- Design philosophy: Avoid "AI slop" aesthetics
- Workflow: Initialize → Develop → Bundle → Share → Test

**2. mcp-builder**

- Create MCP servers for API integration
- TypeScript service integration patterns

**3. webapp-testing**

- Playwright-based UI testing
- Python scripts with helper utilities
- Static HTML → direct read
- Dynamic apps → wait for networkidle before DOM inspection
- Utilities: `with_server.py` for lifecycle management

**4. skill-creator**

- Meta skill for creating custom skills
- Guidance on extending Claude capabilities

**Installation:**

```bash
# Claude Code
/plugin marketplace add anthropics/skills

# Claude.ai
Upload via settings (paid plans)

# Claude API
Use Skills API Quickstart
```

---

### 4. jeremylongshore/claude-code-plugins-plus

**Type:** Largest marketplace with auto-generated Agent Skills
**URL:** <https://github.com/jeremylongshore/claude-code-plugins-plus>
**Marketplace:** claudecodeplugins.io

**Scale:**

- 227 production-ready plugins
- 231 auto-generated Agent Skills (v1.2.0)
- 5 MCP servers (executable Node.js applications)

**Directory Structure:**

```sh
plugins/                   # 227 plugins
  ├── ai-ml/              # 28 plugins
  ├── database/           # 25 plugins
  ├── devops/             # 29 plugins
  ├── security/           # 27 plugins
  ├── testing/            # 25 plugins
  └── performance/        # 25 plugins
skills/
  └── skill-adapter/      # 231 auto-generated Agent Skills
MCP-servers/              # 5 executable applications
```

**Agent Skills Characteristics:**

- Average size: 3,210 bytes (17x larger than Anthropic's 500-byte examples)
- Multi-phase workflows
- Code examples
- Error handling
- Progressive disclosure

**Auto-Generation:**

- Batch-processed with Vertex AI Gemini 2.0 Flash
- 100% success rate
- $0 processing cost
- Enhances plugins with teaching context

**MCP Servers:**

1. **project-health-auditor** - Code complexity, technical debt
2. **conversational-api-debugger** - REST API troubleshooting
3. **domain-memory-agent** - Semantic knowledge base, TF-IDF search

**Installation:**

```bash
/plugin marketplace add jeremylongshore/claude-code-plugins-plus
/plugin install [plugin-name]@claude-code-plugins-plus
```

---

### 5. lackeyjb/playwright-skill (373★ - E2E Testing)

**Type:** Specialized Playwright testing skill
**URL:** <https://github.com/lackeyjb/playwright-skill>

**Key Innovation: Universal Executor Pattern**

Solves dynamic code execution + module resolution issues:

```javascript
// run.js - Universal executor concept
// 1. Receives Claude-generated Playwright code
// 2. Handles module resolution (avoiding "cannot find module" errors)
// 3. Executes in proper context with dependencies available
// 4. Returns screenshots, console output, execution results
// 5. Cleans up temporary files without race conditions
```

**Progressive Disclosure:**

- **SKILL.md** - 314 lines (core instructions)
- **API_REFERENCE.md** - 630 lines (advanced topics, loaded on demand)

**Token Efficiency:** ~2.5x savings vs persistent MCP server

**Testing Domains:**

- Functional testing (forms, navigation, workflows)
- Visual testing (responsive design, screenshots)
- Interaction testing (clicks, fills, multi-step flows)
- Validation testing (links, images, form validation)

**Key Advantage:**
Instead of serializing accessibility trees on every action (MCP pattern), Claude just writes code and runs it—far more token-efficient.

**Adaptable to:**

- Vitest integration
- tsc-files CLI testing
- Any test framework needing dynamic code execution

---

### 6. mhattingpete/claude-skills-marketplace

**Type:** Plugin-based marketplace with formal structure
**URL:** <https://github.com/mhattingpete/claude-skills-marketplace>

**Manifest System:**

**marketplace.json (root):**

```json
{
  "name": "marketplace-identifier",
  "owner": { "name": "Author Name", "email": "email@example.com" },
  "plugins": [
    {
      "name": "plugin-identifier",
      "source": "./plugin-directory",
      "description": "Plugin description",
      "version": "1.0.0"
    }
  ]
}
```

**plugin.json (plugin directory):**

```json
{
  "name": "plugin-identifier",
  "version": "1.0.0",
  "description": "Plugin description with capabilities",
  "author": { "name": "Author Name" }
}
```

**SKILL.md Format:**

```yaml
---
name: skill-identifier
description: Brief description including activation triggers
---
# Skill Title

## When to Use
## Core Workflow
## Best Practices
## Example Workflows
## Integration Points
```

**AGENT.md Format:**

```markdown
# Agent Name

## Purpose

## Model (haiku/sonnet/opus)

## Operational Principles

## Workflow

## Quality Standards
```

**Installation:**

```bash
/plugin marketplace add mhattingpete/claude-skills-marketplace
```

---

### 7. alirezarezvani/claude-skills

**Type:** Toolkit library with Python CLI tools
**URL:** <https://github.com/alirezarezvani/claude-skills>

**Structure:**

```sh
{domain}-team/
  ├── {role-name}/
  │   ├── SKILL.md              # Master documentation
  │   ├── scripts/              # Python CLI tools (3 per skill)
  │   │   ├── analyzer.py
  │   │   ├── generator.py
  │   │   └── scaffolder.py
  │   ├── references/           # Detailed guides (3 per skill)
  │   ├── assets/               # Templates (YAML, Markdown)
  │   └── {role-name}.zip       # Compressed package
```

**Installation:**

```bash
# Clone repository
git clone https://github.com/alirezarezvani/claude-skills.git

# Execute Python tools directly
python marketing-team/content-creator/scripts/brand_voice_analyzer.py --help

# Or reference in Claude prompts
"Using the content-creator skill, help me write..."
```

---

### 8. agent-skill-creator (Meta-Tool)

**Type:** Autonomous skill generation tool
**URL:** <https://github.com/FrancyJGLisboa/agent-skill-creator>

**Five-Phase Process (60-90 minutes, autonomous):**

1. **Discovery** - Research APIs, compare options
2. **Design** - Define 4-6 analyses, methodologies
3. **Architecture** - Structure folders, caching strategies
4. **Detection** - List domain entities, create activation description
5. **Implementation** - Create all files, tests, references

**Output Structure:**

```sh
agent-name/
├── .claude-plugin/marketplace.json  # ⚠️ Created FIRST
├── SKILL.md                         # 5,000-7,000 words
├── scripts/                         # Modular (fetch, parse, analyze)
├── tests/                           # ≥25 tests, ≥80% coverage
├── references/                      # 4,500+ words real content
└── assets/                          # Configs, metadata
```

**Quality Standards:**

- ✅ Production-ready code (no TODOs/placeholders)
- ✅ Type hints and comprehensive docstrings
- ✅ Robust error handling with retries
- ✅ Real configs (not "YOUR_KEY_HERE")
- ✅ 25+ tests, ≥80% coverage
- ✅ Complete SKILL.md (5,000+ words)

**Four Validation Layers:**

1. Parameter validation (user inputs)
2. Data validation (API responses)
3. Temporal validation (dates, ranges)
4. Completeness validation (coverage)

---

### 9. Curated Lists Analysis

**travisvn/awesome-claude-skills:**

- Awesome-list format
- Official vs community sections
- Verification status badges

**abubakarsiddik31/claude-skills-collection:**

- 10 functional categories
- Tabular format with source repos
- Explicit official vs community labeling

**littleben/awesomeAgentskills:**

- 6 domains (Official, Framework Docs, Performance/SEO, i18n, Deployment, Community)
- Impact metrics (PageSpeed scores, etc.)
- Practical, outcome-focused

---

## Top 30 Skills for TypeScript/React/Node

### Core Development Workflow (8)

1. **test-driven-development** (superpowers) - RED-GREEN-REFACTOR automation
2. **subagent-driven-development** (superpowers) - Parallel agents, quality gates
3. **artifacts-builder** (official) - React/Tailwind/shadcn/ui generation
4. **mcp-builder** (official) - API integration development
5. **systematic-debugging** (superpowers) - 4-phase root cause process
6. **brainstorming** (superpowers) - Socratic design refinement
7. **writing-plans** (superpowers) - Implementation strategies with checkpoints
8. **executing-plans** (superpowers) - Batch execution with verification

### Testing & Quality (6)

9. **webapp-testing** (official) - Playwright E2E testing
10. **condition-based-waiting** (superpowers) - Async test patterns
11. **testing-anti-patterns** (superpowers) - Pitfall detection
12. **defense-in-depth** (superpowers) - Multi-layer validation
13. **verification-before-completion** (superpowers) - Confirmation workflows
14. **subagent-testing** (superpowers) - Skill quality validation

### Git & DevOps (5)

15. **git-worktrees** (superpowers) - Parallel branch management
16. **finishing-development-branch** (superpowers) - Merge/PR decision workflow
17. **changelog-generator** (community) - Automated version tracking
18. **deployment-automation** (community) - GitHub + Vercel orchestration
19. **requesting-code-review** (superpowers) - Pre-review checklist

### Architecture & Planning (4)

20. **architectural-decision management** (community) - ADR tracking
21. **pattern-recognition** (community) - Identify recurring patterns
22. **scale-game** (community) - Stress-test at extreme scales
23. **collision-zone-thinking** (community) - Combine unrelated concepts

### TypeScript/React Specific (4)

24. **Shipany Framework Documentation** (community) - Next.js 15 + Drizzle + NextAuth
25. **Web Accessibility** (community) - WCAG 2.1 compliance automation
26. **Internationalization** (community) - Multi-language Next.js + SEO
27. **theme-factory** (official) - Design system creation

### Productivity & Meta (3)

28. **dispatching-parallel-agents** (superpowers) - Concurrent subagent workflows
29. **remembering-conversations** (community) - Persistent context across sessions
30. **skill-creator** (official) - Interactive skill builder

---

## Key Patterns & Best Practices

### 1. Progressive Disclosure (Anthropic Official)

**Three-Level System:**

**Level 1: Metadata (YAML Frontmatter)**

```yaml
---
name: Processing TypeScript Files
description: Type-checks specific files while respecting tsconfig.json. Use when validating TypeScript in git hooks, lint-staged, or CI/CD workflows.
---
```

- Purpose: Skill discovery without loading full content
- Guidelines: Gerund form, max 64 chars name, max 1024 chars description

**Level 2: SKILL.md Body (<500 lines)**

- High-level guide with conditional references
- Common patterns and examples
- Anti-patterns and pitfalls

**Level 3: Reference Files (On Demand)**

- One-level-deep references from SKILL.md
- Domain-specific (monorepo.md, windows.md)
- Prevents context bloat

**Token Savings:** ~2.5x vs persistent MCP servers

### 2. Universal Executor Pattern (playwright-skill)

**Problem:** Dynamic code execution + module resolution failures

**Solution:**

```javascript
export async function executeTest(code, context) {
  // 1. Create temp file with proper module context
  const tempFile = await createTempTestFile(code);

  // 2. Set up environment with dependencies available
  const env = setupTestEnvironment(context);

  // 3. Execute with proper module resolution
  const result = await executeInContext(tempFile, env);

  // 4. Parse results (JSON, coverage, console output)
  const parsed = parseTestResults(result);

  // 5. Clean up without race conditions
  await safeCleanup(tempFile);

  return parsed;
}
```

**Use Cases:**

- Test framework integration (Vitest, Playwright)
- CLI validation and testing
- Dynamic code generation + execution

### 3. RED-GREEN-REFACTOR for Skills (superpowers)

**RED Phase:**

- Run scenarios WITHOUT skill
- Document baseline behavior
- Capture agent rationalizations verbatim
- Identify specific failure modes

**GREEN Phase:**

- Write minimal skill addressing failures
- Verify agents comply WITH skill

**REFACTOR Phase:**

- Identify new rationalizations
- Add explicit counters
- Re-test until bulletproof

**Critical:** Never deploy untested skills!

### 4. Search Optimization (superpowers-skills)

**Make Skills Discoverable:**

- Rich `when_to_use` with error messages and symptoms
- Keyword repetition in frontmatter/overview/headers
- Verb-first active voice naming
- Multiple discovery touchpoints

**Example:**

```yaml
when_to_use: |
  When you encounter "Module not found" errors, need to run TypeScript
  compiler on specific files, working with lint-staged or git hooks,
  type-checking changed files only, integrating with CI/CD pipelines
```

### 5. Validation Framework (agent-skill-creator)

**Four Validation Layers:**

1. **Parameter validation** - User inputs with clear errors
2. **Data validation** - API responses match schemas
3. **Temporal validation** - Valid dates, ranges, no gaps
4. **Completeness validation** - All expected data present

**Integration:**
Functions return validation metadata alongside results for transparent quality status.

### 6. Context-Aware Activation (marketplace pattern)

**How It Works:**

- Claude reads SKILL.md frontmatter at startup
- Loads trigger phrases for context recognition
- Auto-activates based on conversation matching
- Zero manual commands needed

**Trigger Examples:**

```yaml
triggers:
  keywords: [type-check, tsc, tsconfig, lint-staged]
  patterns: ['type[ -]check', 'run.*tsc', 'check.*types']
  contexts: [development, testing, ci-cd]
```

---

## Skill Format Standards

### Minimal Format (Anthropic Official)

```yaml
---
name: skill-name
description: Complete description of functionality and use cases
---
```

### Rich Format (Community Best Practice)

```yaml
---
# REQUIRED
name: skill-identifier # kebab-case
version: 1.0.0 # semantic versioning
description: |
  What it does + when to use + activation triggers

# OPTIONAL
category: workflow-automation
tags: [tag1, tag2]
author: Name
license: MIT
model: sonnet # sonnet | haiku | opus

# DEPENDENCIES
requires:
  skills: []
  agents: []
  tools: []

# ACTIVATION
triggers:
  keywords: []
  patterns: []
  contexts: []
---
```

### Content Structure Best Practices

```markdown
# Skill Name

## Overview (1-2 sentences max)

## When to Use

- Concrete triggers and symptoms

## Core Pattern / Quick Reference

- Before/after comparisons or scannable tables

## Implementation

- Inline code for simple patterns
- Link to API_REFERENCE.md for heavy reference

## Common Mistakes

- Specific failures + fixes

## Example Workflows

### Scenario 1

### Scenario 2

## Integration Points

- Works with: other skills
- Calls: agents/tools

## Troubleshooting

### Issue 1

### Issue 2

## References

- Links to external docs
```

---

## Token Efficiency Targets

**From superpowers-skills:**

- Getting-started workflows: <150 words
- Frequently-loaded skills: <200 words
- Other skills: <500 words

**Strategy:**

- Reference tool help instead of duplicating
- Cross-link related skills
- Eliminate redundancy
- Use progressive disclosure (SKILL.md → API_REFERENCE.md)

---

## Anti-Patterns to Avoid

From community best practices:

- ❌ Narrative examples tied to specific sessions
- ❌ Multi-language dilution (one excellent example > five mediocre)
- ❌ Generic labels (helper1, step2)
- ❌ Code embedded in flowcharts
- ❌ Flowcharts for linear instructions
- ❌ TODOs or placeholders in production skills
- ❌ "YOUR_KEY_HERE" style configs
- ❌ Untested skills deployed to production

---

## Installation Methods

### Claude Code CLI

```bash
# Plugin marketplace
/plugin marketplace add org/repo
/plugin install [plugin-name]

# Direct installation
git clone https://github.com/org/repo ~/.claude/skills/repo-name
```

### Claude.ai Web

- Upload custom skills via settings
- Available to paid plans

### Claude API

- Use Skills API Quickstart
- Programmatic skill loading

---

## Marketplace Infrastructure Gaps

Current limitations (opportunities for super-claude):

- ❌ No dependency management
- ❌ No version conflict resolution
- ❌ No automated updates
- ❌ No central registry/catalog
- ❌ No permission/security model
- ❌ No skill discovery beyond README browsing
- ❌ No usage analytics
- ❌ No testing framework for skills
- ❌ No rollback mechanism
- ❌ Limited metadata for search/filtering

---

## Recommended Next Steps for super-claude

### Immediate (Weeks 1-2)

1. **tsc-files-validation-skill** - Adapt playwright-skill universal executor
2. **git/smart-commit** - Conventional commits helper
3. Install obra/superpowers for TDD/debugging foundation

### High Priority (Weeks 3-4)

4. **vitest-integration-skill** - Adapt playwright-skill for Vitest
5. **typescript/refactor-imports** - Path alias management
6. **testing/coverage-improve** - Identify untested code

### Medium Priority (Weeks 5-6)

7. **frontend/component-generator** - React patterns
8. **testing/monorepo-testing** - Multi-package strategies
9. **frontend/tailwind-helper** - Utility optimization

---

## Resources & References

### Official

- [anthropics/skills](https://github.com/anthropics/skills) - Official examples
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)

### Community Foundations

- [obra/superpowers](https://github.com/obra/superpowers) - Plugin system
- [obra/superpowers-skills](https://github.com/obra/superpowers-skills) - Community collection

### Specialized

- [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) - Universal executor
- [jeremylongshore/claude-code-plugins-plus](https://github.com/jeremylongshore/claude-code-plugins-plus) - Largest marketplace
- [FrancyJGLisboa/agent-skill-creator](https://github.com/FrancyJGLisboa/agent-skill-creator) - Autonomous generation

### Curated Lists

- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [abubakarsiddik31/claude-skills-collection](https://github.com/abubakarsiddik31/claude-skills-collection)
- [littleben/awesomeAgentskills](https://github.com/littleben/awesomeAgentskills)

---

**Last Updated:** 2025-01-21
**Next Review:** When significant new patterns emerge or official marketplace launches
