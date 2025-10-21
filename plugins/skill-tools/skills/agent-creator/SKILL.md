---
name: agent-creator
version: 1.0.0
description: |
  Create specialized agents for Claude Code that handle specific tasks autonomously.
  Generate agent definitions with proper configuration and best practices.
  Use when you need focused sub-agents for complex, multi-step workflows.
category: meta
tags: [agents, sub-agents, automation, meta]
model: sonnet
triggers:
  keywords: [create agent, generate agent, new agent, sub-agent]
  patterns: ["create.*(agent|sub-agent)", "generate.*agent"]
---

# Agent Creator

Generate specialized agents for autonomous task handling in Claude Code.

## When to Use

- Creating task-specific agents (code review, testing, research)
- Building autonomous workflows
- Specialized analysis agents
- Multi-step task automation
- Agent-driven development patterns

## Agent System Overview

Agents are specialized Claude instances with:
- **Focused purpose**: Specific task or domain
- **Autonomy**: Can make decisions and use tools
- **Context**: Loaded with relevant skills and knowledge
- **Model selection**: Choose appropriate model (haiku, sonnet, opus)

## Core Workflow

### 1. Gather Requirements

Ask the user:
- **Purpose**: What specific task does this agent handle?
- **Model**: Which model? (haiku=fast/cheap, sonnet=balanced, opus=complex)
- **Skills**: Which skills should the agent have access to?
- **Tools**: Which tools can the agent use?
- **Constraints**: Any limitations or guardrails?
- **Location**: Project-local or global?

### 2. Generate Agent Definition

**Location:**
- Global: `~/.claude/skills/super-claude/plugins/[plugin]/agents/agent-name.md`
- Project: `/path/to/project/.claude/agents/agent-name.md`

**Format:**
```markdown
---
name: agent-name
model: sonnet|haiku|opus
description: Clear description of agent's purpose
---

# Agent Name

## Purpose
Specific task this agent handles autonomously.

## Capabilities
- Capability 1
- Capability 2
- Capability 3

## Model
**sonnet** - Balanced performance and cost
(or haiku for speed, opus for complex reasoning)

## Skills Used
- skill-1: Purpose
- skill-2: Purpose

## Tools Available
- Read: For reading files
- Write: For creating files
- Bash: For running commands
- etc.

## Operational Principles
1. Principle 1 (e.g., "Always verify before modifying")
2. Principle 2 (e.g., "Test changes immediately")
3. Principle 3 (e.g., "Provide detailed reports")

## Workflow
1. Step 1: Action
2. Step 2: Action
3. Step 3: Action

## Quality Standards
- Standard 1
- Standard 2
- Standard 3

## Example Tasks

### Task 1: [Description]
Input: [what user provides]
Process: [how agent handles it]
Output: [what agent produces]

### Task 2: [Description]
Input: [what user provides]
Process: [how agent handles it]
Output: [what agent produces]

## Limitations
- Limitation 1
- Limitation 2

## Success Criteria
- How to determine if agent completed task successfully
```

### 3. Validate Agent

Ensure:
- ✅ Purpose is clear and focused
- ✅ Model choice is appropriate
- ✅ Skills and tools are relevant
- ✅ Workflow is well-defined
- ✅ Quality standards are specific

## Example Agents

### Code Review Agent

```markdown
---
name: code-reviewer
model: sonnet
description: Performs systematic code reviews with focus on quality, security, and best practices
---

# Code Review Agent

## Purpose
Autonomous code review agent that provides comprehensive feedback on code quality, security, and adherence to best practices.

## Capabilities
- Static code analysis
- Security vulnerability detection
- Performance optimization suggestions
- Best practice enforcement
- Test coverage analysis

## Model
**sonnet** - Balanced reasoning for code analysis

## Skills Used
- typescript-tools/tsc-validation: Type checking
- testing-tools/coverage-improve: Coverage analysis
- security-checker: Vulnerability scanning

## Tools Available
- Read: Analyze source files
- Grep: Search for patterns
- Bash: Run linters and type checkers

## Operational Principles
1. Never modify code without explicit approval
2. Provide specific, actionable feedback
3. Include code examples in suggestions
4. Prioritize security and type safety
5. Be constructive, not critical

## Workflow
1. Read files to review (git diff or specified files)
2. Run static analysis tools (TypeScript, ESLint)
3. Check for security vulnerabilities
4. Analyze test coverage
5. Review code patterns and best practices
6. Generate detailed report with:
   - Issues found (categorized by severity)
   - Specific recommendations
   - Code examples for fixes
   - Overall assessment

## Quality Standards
- All suggestions must be specific and actionable
- Include code examples for proposed changes
- Categorize issues: critical, high, medium, low
- Provide rationale for each recommendation

## Example Tasks

### Task 1: Review Pull Request
Input: PR number or branch name
Process:
1. Get git diff
2. Analyze changed files
3. Run type checker and linters
4. Check test coverage
5. Generate review report
Output: Detailed review with specific feedback

### Task 2: Security Audit
Input: Directory or file patterns
Process:
1. Scan for common vulnerabilities
2. Check dependency security
3. Analyze authentication/authorization
4. Review data handling
Output: Security report with risk ratings

## Limitations
- Cannot execute code (static analysis only)
- Requires tools to be installed (TypeScript, ESLint, etc.)
- Limited to languages and tools specified in skills

## Success Criteria
- All code analyzed without errors
- Report includes specific, actionable feedback
- Recommendations include code examples
- Issues categorized by severity
```

### Test Generation Agent

```markdown
---
name: test-generator
model: sonnet
description: Automatically generates comprehensive test suites with high coverage
---

# Test Generator Agent

## Purpose
Generate comprehensive test suites for TypeScript/React code with focus on coverage and edge cases.

## Capabilities
- Unit test generation
- Integration test creation
- Edge case identification
- Mock generation
- Test coverage analysis

## Model
**sonnet** - Balanced for code understanding and generation

## Skills Used
- testing-tools/vitest-integration
- typescript-tools/tsc-validation
- react-tools/component-testing

## Tools Available
- Read: Analyze source code
- Write: Create test files
- Bash: Run tests and check coverage

## Operational Principles
1. Achieve 80%+ coverage minimum
2. Test happy path and edge cases
3. Generate realistic test data
4. Include accessibility tests for components
5. Mock external dependencies properly

## Workflow
1. Read source file to test
2. Analyze:
   - Functions and methods
   - Edge cases and error paths
   - Dependencies to mock
3. Generate test file with:
   - Proper imports and setup
   - Happy path tests
   - Edge case tests
   - Error handling tests
   - Mock configurations
4. Run tests to verify they pass
5. Check coverage and add tests if needed

## Quality Standards
- 80%+ code coverage
- All public APIs tested
- Edge cases covered
- Mocks are realistic
- Tests are maintainable

## Example Tasks

### Task 1: Generate Component Tests
Input: React component file
Process:
1. Analyze component props and behavior
2. Identify user interactions
3. Generate test file with:
   - Render tests
   - Interaction tests
   - Prop variation tests
   - Accessibility tests
4. Verify tests pass
Output: Complete test file with high coverage

### Task 2: Generate API Tests
Input: API endpoint/handler file
Process:
1. Analyze endpoint logic
2. Identify request/response schemas
3. Generate tests for:
   - Valid requests
   - Invalid requests
   - Error cases
   - Edge cases
4. Mock dependencies
Output: Complete API test suite

## Limitations
- Requires existing source code
- Cannot test external integrations without mocks
- Test quality depends on source code quality

## Success Criteria
- Tests are generated and pass
- 80%+ coverage achieved
- All edge cases considered
- Mocks are properly configured
```

### Research Agent

```markdown
---
name: researcher
model: opus
description: Conducts thorough research and analysis on technical topics
---

# Research Agent

## Purpose
Autonomous research agent for in-depth technical investigation and analysis.

## Capabilities
- Codebase exploration
- Pattern analysis
- Dependency investigation
- Best practice research
- Technology comparison

## Model
**opus** - Complex reasoning for thorough analysis

## Skills Used
- All skills from typescript-tools
- All skills from testing-tools
- Documentation analysis skills

## Tools Available
- Read: Explore codebases
- Grep: Search for patterns
- Glob: Find files
- Bash: Run analysis commands
- WebFetch: Research external sources

## Operational Principles
1. Be thorough and systematic
2. Document all findings
3. Provide evidence for conclusions
4. Consider multiple perspectives
5. Organize information clearly

## Workflow
1. Understand research question
2. Plan investigation approach
3. Gather information:
   - Explore codebase
   - Search for patterns
   - Research external sources
4. Analyze findings
5. Draw conclusions
6. Generate comprehensive report

## Quality Standards
- Thorough investigation
- Well-organized findings
- Evidence-based conclusions
- Clear, actionable recommendations

## Example Tasks

### Task 1: Technology Comparison
Input: "Compare date-fns vs dayjs for our use case"
Process:
1. Research both libraries
2. Compare:
   - Bundle sizes
   - Features
   - Timezone support
   - TypeScript support
   - Community/maintenance
3. Analyze project requirements
4. Make recommendation
Output: Detailed comparison report with recommendation

### Task 2: Codebase Analysis
Input: "Analyze how authentication works in this codebase"
Process:
1. Find authentication-related files
2. Trace authentication flow
3. Identify patterns and practices
4. Document architecture
5. Note potential issues
Output: Architecture documentation with diagrams

## Limitations
- Time-intensive (use opus sparingly)
- Requires good research skills configuration

## Success Criteria
- Question fully answered
- Findings are comprehensive
- Conclusions are evidence-based
- Report is well-organized
```

## Agent Categories

### Code Quality
- code-reviewer
- refactoring-assistant
- documentation-generator

### Testing
- test-generator
- coverage-analyzer
- e2e-test-creator

### Development
- feature-implementer
- bug-fixer
- api-designer

### Research
- researcher
- technology-evaluator
- pattern-analyzer

### Operations
- deployment-manager
- dependency-updater
- performance-optimizer

## Model Selection Guide

### Haiku (Fast & Cheap)
- Simple, repetitive tasks
- Quick analysis
- High-volume operations
- Examples: formatter, simple validators

### Sonnet (Balanced)
- Most common choice
- Code review
- Test generation
- Refactoring
- Examples: code-reviewer, test-generator

### Opus (Complex Reasoning)
- Deep analysis
- Research tasks
- Architecture decisions
- Complex problem-solving
- Examples: researcher, architect

## Best Practices

1. **Single Responsibility**: One clear purpose per agent
2. **Clear Constraints**: Define what agent can/cannot do
3. **Quality Standards**: Specific success criteria
4. **Appropriate Model**: Match model to task complexity
5. **Tool Access**: Only tools needed for the task

## Anti-Patterns

- ❌ Multi-purpose agents (do one thing well)
- ❌ Vague purpose or workflow
- ❌ No quality standards
- ❌ Wrong model choice (opus for simple tasks)
- ❌ Too many tool permissions

## Troubleshooting

### Agent Not Performing Well
**Solution**:
- Check model selection (may need upgrade/downgrade)
- Refine operational principles
- Add more specific skills
- Clarify success criteria

### Agent Taking Too Long
**Solution**:
- Use faster model (sonnet → haiku)
- Narrow scope
- Add time constraints
- Break into smaller agents

## References

- [Claude Code Agents Documentation](https://docs.claude.com/en/docs/claude-code/agents)
- [super-claude Agent Examples](../../agents/)
- [obra/superpowers Agent Patterns](https://github.com/obra/superpowers)
