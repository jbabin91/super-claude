# CLAUDE.md

This file provides guidance to Claude Code when working with the super-claude repository.

## 📋 Project Context

**Project Name:** super-claude
**Purpose:** Comprehensive collection of Claude Code skills, agents, hooks, and utilities
**Focus:** TypeScript, React, Node.js, Testing, Git workflows
**Status:** 🚧 Initial scaffold complete, ready for skill development

## 🎯 Project Mission

Create a curated, well-documented collection of Claude Code enhancements that:

- Automate repetitive development workflows
- Enforce best practices and quality standards
- Support both personal and work projects (with privacy)
- Provide reusable patterns for the TypeScript/React/Node ecosystem

## 🏗️ Architecture

### Directory Structure

```sh
super-claude/
├── plugins/          # Plugin packages organized by category
│   ├── skill-tools/         # Meta-tools for creating skills
│   ├── typescript-tools/    # TypeScript development
│   ├── testing-tools/       # Testing automation
│   ├── git-tools/          # Git workflows
│   ├── frontend-tools/     # React/Frontend tools
│   └── devops-tools/       # DevOps automation
├── .claude-plugin/   # Marketplace configuration
├── configs/         # Configuration templates and examples
└── docs/            # Guides and best practices
```

### Key Files

- **RESEARCH_FINDINGS.md** - Complete research on 11 GitHub repos (READ THIS FIRST!)
- **docs/CREATING_SKILLS.md** - How to build skills (RED-GREEN-REFACTOR)
- **configs/templates/SKILL_TEMPLATE.md** - Skill scaffolding template
- **.claude-plugin/marketplace.json** - Plugin marketplace manifest

## 🔒 Privacy & Security

### Gitignored Content

- `configs/global.json` - Personal config
- `configs/projects/*.json` - Project-specific configs

### Public Content

- `plugins/*` - Generic, reusable plugins with skills
- Documentation and templates
- Marketplace configuration

### Project-Specific Skills

For project-specific or work-related skills:

- Install plugins globally: `~/.claude/skills/super-claude`
- Create project-specific skills in: `<project>/.claude/skills/`

## 🎨 Development Workflow

### Creating New Skills

**ALWAYS follow RED-GREEN-REFACTOR:**

1. **RED Phase**
   - Run scenarios WITHOUT the skill
   - Document failures and agent rationalizations
   - Identify specific problems to solve

2. **GREEN Phase**
   - Write minimal skill addressing failures
   - Use `configs/templates/SKILL_TEMPLATE.md`
   - Test that Claude complies with skill

3. **REFACTOR Phase**
   - Identify new rationalizations
   - Add explicit counters and guards
   - Re-test until bulletproof

**Never deploy untested skills!**

### Skill File Format

**Required YAML frontmatter:**

```yaml
---
name: skill-identifier              # kebab-case
version: 1.0.0                      # semantic versioning
description: |
  What it does + when to use + activation triggers
category: workflow-automation
tags: [tag1, tag2]
model: sonnet                       # sonnet | haiku | opus
requires:
  tools: [git, npm]                # External dependencies
triggers:
  keywords: [keyword1, keyword2]
  patterns: ["pattern1"]
---
```

### Progressive Disclosure

Keep skills token-efficient:

- **SKILL.md**: < 500 lines (core instructions)
- **API_REFERENCE.md**: Advanced topics (loaded on demand)
- **Target**: < 500 words for frequently-loaded skills

### Universal Executor Pattern

For skills that generate and execute code (testing, CLI validation):

```javascript
// run.js - Universal executor
export async function execute(code, context) {
  // 1. Create temp file with proper module context
  // 2. Set up environment with dependencies
  // 3. Execute with proper module resolution
  // 4. Parse results
  // 5. Clean up without race conditions
}
```

See `RESEARCH_FINDINGS.md` → "playwright-skill" section for complete pattern.

### Markdown Formatting Standards

**ALWAYS follow these markdownlint rules to avoid warnings:**

#### 1. Code Fences Must Have Language Identifiers (MD040)

**Wrong:**

````markdown
```
code here
```
````

**Right:**

````markdown
```sh
code here
```

```txt
text content
```

```yaml
yaml: content
```
````

#### 2. Blank Line Required Before Lists (MD032)

**Wrong:**

```markdown
Ask the user:
- **Purpose**: What does this do?
```

**Right:**

```markdown
Ask the user:

- **Purpose**: What does this do?
```

#### 3. Blank Line After Headings Before Content (MD022/MD023)

**Wrong:**

```markdown
### Model Selection Guide
### Haiku (Fast & Cheap)
- Simple tasks
```

**Right:**

```markdown
### Model Selection Guide

### Haiku (Fast & Cheap)

- Simple tasks
```

#### 4. Blank Line Before Nested Content

**Wrong:**

```markdown
**Solution**:
- Check syntax
```

**Right:**

```markdown
**Solution**:

- Check syntax
```

#### Common Language Identifiers

**Preferred Usage:**

- `sh` - Terminal/CLI examples, folder structures, shell commands
- `txt` - Default fallback when unsure what category it falls under
- `yaml` - YAML configuration
- `json` - JSON data
- `markdown` - Markdown examples
- `typescript` or `ts` - TypeScript code
- `javascript` or `js` - JavaScript code
- `jsx` or `tsx` - React components

**Rule of Thumb:** Use `sh` for terminal/CLI and folder structures, use `txt` when unsure.

## 📚 Key Resources

### Before Starting Work

**ALWAYS read these first:**

1. **RESEARCH_FINDINGS.md** - All research data (saves hours of re-research)
2. **docs/CREATING_SKILLS.md** - Skill development guide
3. **Relevant category in plugins/** - See existing patterns

### Skill Development References

- **obra/superpowers** - Best practices, TDD workflows
- **playwright-skill** - Universal executor pattern
- **anthropics/skills** - Official examples, progressive disclosure

### Top Patterns to Use

1. **Progressive Disclosure** - SKILL.md → API_REFERENCE.md (~2.5x token savings)
2. **Universal Executor** - For test frameworks, CLI testing
3. **RED-GREEN-REFACTOR** - Skill development methodology
4. **Validation Framework** - Multi-layer validation (parameter, data, temporal, completeness)
5. **Context-Aware Activation** - Auto-trigger via keywords/patterns

## 🎯 Implementation Priorities

### Phase 1: Foundation (Weeks 1-2)

**High Priority - Build First:**

1. **typescript/tsc-files-validation**
   - Pattern: playwright-skill universal executor
   - Purpose: CLI testing across scenarios
   - Tests: monorepo, package managers, cross-platform

2. **git/smart-commit**
   - Pattern: Simple workflow skill
   - Purpose: Conventional commits with gitmoji
   - Auto-format commit messages

3. **Install obra/superpowers**
   - Get battle-tested TDD and debugging workflows
   - Use as foundation for quality practices

### Phase 2: Testing & Quality (Weeks 3-4)

4. **testing/vitest-integration**
   - Adapt playwright-skill for Vitest runtime
   - Dynamic test generation + execution
   - Coverage analysis helpers

5. **typescript/refactor-imports**
   - Path alias management
   - Import organization and cleanup
   - Detect unused imports

6. **testing/coverage-improve**
   - Identify untested code paths
   - Generate tests for uncovered areas
   - Coverage gap analysis

### Phase 3: Frontend & Workflows (Weeks 5-6)

7. **frontend/component-generator**
   - React functional component scaffolding
   - TypeScript + best practices
   - Include tests and Storybook stories

8. **testing/monorepo-testing**
   - Nx, Turborepo, pnpm workspaces support
   - Per-package validation strategies
   - Dependency graph awareness

9. **frontend/tailwind-helper**
   - Utility class optimization
   - Responsive design patterns
   - Color palette management


## 🚫 Anti-Patterns to Avoid

From community research:

- ❌ Narrative examples tied to specific sessions
- ❌ Generic labels (helper1, step2, utils)
- ❌ Code embedded in flowcharts
- ❌ TODOs or placeholders in skills
- ❌ "YOUR_KEY_HERE" style configs
- ❌ Untested skills
- ❌ Multi-language dilution (focus on TS/JS/React)

## 📖 Skill Categories

### TypeScript

- Type checking, refactoring, test generation
- Build system integration
- Compiler optimization

### Frontend

- React component generation
- Tailwind utilities
- Design system integration
- Storybook helpers

### Testing

- Vitest integration
- Playwright E2E
- Coverage improvement
- Monorepo testing strategies

### Git

- Smart commits (conventional + gitmoji)
- PR descriptions
- Changelog generation
- Worktree management

### DevOps

- Docker Compose helpers
- Environment variable management
- GitHub Actions generation
- CI/CD workflows

## 🎓 Learning from Research

### Key Insights (from RESEARCH_FINDINGS.md)

1. **No official marketplace exists** - Community-driven via GitHub
2. **Progressive disclosure = 2.5x token savings** vs persistent MCP servers
3. **obra/superpowers = best foundation** - 324★, battle-tested
4. **Universal executor = critical pattern** for test frameworks
5. **RED-GREEN-REFACTOR = non-negotiable** for skill quality

### Top Skills to Reference

**For TDD:**

- obra/superpowers → `test-driven-development`
- obra/superpowers → `testing-anti-patterns`
- obra/superpowers → `systematic-debugging`

**For Testing Frameworks:**

- lackeyjb/playwright-skill → Universal executor pattern
- anthropics/skills → `webapp-testing` (Playwright integration)

**For Code Quality:**

- obra/superpowers → `defense-in-depth`
- obra/superpowers → `verification-before-completion`
- obra/superpowers → `code-review`

**For Workflows:**

- obra/superpowers → `subagent-driven-development`
- obra/superpowers → `dispatching-parallel-agents`
- obra/superpowers → `git-worktrees`

## 🔧 Development Commands

### Installation

```bash
# Install from marketplace
/plugin marketplace add jbabin91/super-claude

# Install specific plugins
/plugin install skill-tools          # Meta-tools for creating skills
/plugin install typescript-tools     # TypeScript development
/plugin install testing-tools        # Testing automation
```

### Creating Skills

Use the skill-tools plugin to create new skills:

```bash
# Install skill-tools first
/plugin install skill-tools

# Skills auto-activate based on conversation context
# Use skill-creator to generate new skills
```

### Testing

```bash
# Manual testing in Claude Code
# 1. Create skill using skill-creator
# 2. Open Claude Code in relevant project
# 3. Trigger skill through conversation
# 4. Verify behavior matches expectations
# 5. Iterate based on failures
```

## 📝 Commit Conventions

Follow conventional commits with gitmoji:

```bash
# Format
<type>(<scope>): <gitmoji> <description>

# Examples
feat(typescript): :sparkles: add tsc-files-validation skill
docs: :memo: update RESEARCH_FINDINGS with playwright analysis
fix(git): :bug: correct smart-commit message parsing
chore: :hammer: update installation scripts
```

**Types:**

- `feat` - New skills or features
- `fix` - Bug fixes in skills
- `docs` - Documentation updates
- `chore` - Maintenance tasks
- `refactor` - Code restructuring
- `test` - Test additions/changes

**Gitmojis:**

- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 📝 `:memo:` - Documentation
- 🔨 `:hammer:` - Scripts/tooling
- ♻️ `:recycle:` - Refactoring

## 🎯 Session Workflow

### Starting a New Session

1. **Read RESEARCH_FINDINGS.md** - Understand community patterns
2. **Review current priorities** - See "Implementation Priorities" above
3. **Check existing skills** - See what patterns already exist
4. **Plan before building** - Use Plan Mode for complex skills

### During Skill Development

1. **RED Phase** - Document failures without skill
2. **GREEN Phase** - Minimal implementation
3. **REFACTOR Phase** - Harden against rationalizations
4. **Test thoroughly** - Manual testing in Claude Code
5. **Document learnings** - Update docs with insights

### Before Committing

1. Verify skill works in Claude Code
2. Check .gitignore (no personal configs)
3. Update README if adding new skill
4. Follow commit conventions

## 🚀 Quick Reference

**Most Important Files:**

1. `RESEARCH_FINDINGS.md` - Start here
2. `docs/CREATING_SKILLS.md` - Skill development
3. `configs/templates/SKILL_TEMPLATE.md` - Template

**Key Patterns:**

- Progressive Disclosure (token efficiency)
- Universal Executor (test frameworks)
- RED-GREEN-REFACTOR (skill quality)

**Installation:**

```bash
/plugin marketplace add jbabin91/super-claude
/plugin install skill-tools          # Meta-tools for creating skills
```

**Creating Skills:**

Use skill-creator from the skill-tools plugin to generate new skills with proper structure and validation.

---

**Remember:** This is a PUBLIC repository. Always test skills before committing!
