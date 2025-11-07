# Implementation Tasks: Adapt iannuttall/claude-agents

## 1. Repository Setup

- [ ] 1.1 Clone/download iannuttall/claude-agents repository
- [ ] 1.2 Review MIT license terms and compliance
- [ ] 1.3 Create attribution documentation
- [ ] 1.4 Set up tracking for original versions

## 2. Security Plugin Creation

- [ ] 2.1 Create plugins/security/ directory structure
- [ ] 2.2 Create plugins/security/plugin.json
- [ ] 2.3 Create plugins/security/README.md with attribution
- [ ] 2.4 Register security plugin in .claude-plugin/marketplace.json

## 3. Security-Auditor Agent Adaptation

- [ ] 3.1 Copy security-auditor.md to plugins/security/agents/
- [ ] 3.2 Update YAML frontmatter (version, category, tags, model, triggers)
- [ ] 3.3 Remove Mobile Application Security section
- [ ] 3.4 Add TanStack Router security checks
- [ ] 3.5 Add TanStack Query security checks
- [ ] 3.6 Add Hono API security checks (middleware, CORS, rate limiting)
- [ ] 3.7 Add better-auth security checks (session, tokens, validation)
- [ ] 3.8 Add Drizzle ORM security checks (injection, sanitization)
- [ ] 3.9 Add Base UI accessibility security checks
- [ ] 3.10 Add Bun-specific dependency checks
- [ ] 3.11 Update DevOps section for GitHub Actions
- [ ] 3.12 Update tool declarations (remove Task, add Grep/Glob/Read)

## 4. Security-Auditor Progressive Disclosure

- [ ] 4.1 Create plugins/security/docs/ directory
- [ ] 4.2 Extract vulnerability checklists to API_REFERENCE.md
- [ ] 4.3 Create EXAMPLES.md with TanStack/Hono scenarios
- [ ] 4.4 Create TECH_STACK.md with super-claude specifics
- [ ] 4.5 Update main agent to reference docs
- [ ] 4.6 Verify core agent <100 lines

## 5. Design-Spec-Generator Agent Adaptation

- [ ] 5.1 Copy frontend-designer.md to plugins/design-system/agents/
- [ ] 5.2 Rename file to design-spec-generator.md
- [ ] 5.3 Update YAML frontmatter (name, version, triggers, category)
- [ ] 5.4 Update all references from "frontend-designer" to "design-spec-generator"
- [ ] 5.5 Update tech stack defaults (TanStack Start, Base UI, Tailwind)
- [ ] 5.6 Add Base UI integration guidance section
- [ ] 5.7 Update deliverable template with super-claude workflow
- [ ] 5.8 Add "Next Steps" section referencing component-generator
- [ ] 5.9 Emphasize WCAG AAA compliance throughout
- [ ] 5.10 Add explicit exports guidance

## 6. Design-Spec-Generator Integration

- [ ] 6.1 Update plugins/design-system/plugin.json (if needed)
- [ ] 6.2 Update plugins/design-system/README.md to include agent
- [ ] 6.3 Add mockup → spec → component workflow documentation
- [ ] 6.4 Test integration with component-generator skill

## 7. Code-Refactorer Skill Adaptation

- [ ] 7.1 Create plugins/typescript/skills/code-refactorer/ directory
- [ ] 7.2 Copy code-refactorer.md to SKILL.md
- [ ] 7.3 Convert agent format → skill format (YAML frontmatter)
- [ ] 7.4 Add version, category, tags, model, requires, triggers
- [ ] 7.5 Remove agent-specific fields (color, agent tools format)
- [ ] 7.6 Add TypeScript-specific refactoring patterns
- [ ] 7.7 Add React component refactoring patterns
- [ ] 7.8 Add Base UI component patterns
- [ ] 7.9 Add TanStack ecosystem patterns
- [ ] 7.10 Add import/export refactoring guidance (ADR-0005)
- [ ] 7.11 Reference relevant ADRs

## 8. Code-Refactorer Auto-Activation

- [ ] 8.1 Update plugins/typescript/.claude-plugin/skill-rules.json
- [ ] 8.2 Add trigger keywords (refactor, clean up, code quality, etc.)
- [ ] 8.3 Add trigger patterns (improve.*code, clean.*up, etc.)
- [ ] 8.4 Test auto-activation with various prompts
- [ ] 8.5 Adjust triggers based on testing results

## 9. Documentation Updates

- [ ] 9.1 Update plugins/security/README.md with usage examples
- [ ] 9.2 Update plugins/design-system/README.md with agent info
- [ ] 9.3 Update plugins/typescript/README.md with skill info
- [ ] 9.4 Add attribution sections to all adapted files
- [ ] 9.5 Document adaptation changes from originals

## 10. Testing (RED-GREEN-REFACTOR)

### Security-Auditor Testing

- [ ] 10.1 RED: Test security audit requests without agent
- [ ] 10.2 GREEN: Test with security-auditor agent
- [ ] 10.3 Test TanStack security checks
- [ ] 10.4 Test Hono API security checks
- [ ] 10.5 Test better-auth security checks
- [ ] 10.6 Verify report generation

### Design-Spec-Generator Testing

- [ ] 10.7 RED: Test mockup analysis without agent
- [ ] 10.8 GREEN: Test with design-spec-generator agent
- [ ] 10.9 Test with sample Figma mockup
- [ ] 10.10 Verify spec works with component-generator
- [ ] 10.11 Test iteration loop (spec refinement)

### Code-Refactorer Testing

- [ ] 10.12 RED: Test refactoring requests without skill
- [ ] 10.13 GREEN: Test with code-refactorer skill
- [ ] 10.14 Test auto-activation with trigger keywords
- [ ] 10.15 Test TypeScript refactoring patterns
- [ ] 10.16 Test React component refactoring
- [ ] 10.17 Verify no functionality changes

## 11. Validation

- [ ] 11.1 Run bun run format on all adapted files
- [ ] 11.2 Run bun run lint on all adapted files
- [ ] 11.3 Verify ADR-0009 compliance (<500 lines per file)
- [ ] 11.4 Verify proper YAML frontmatter in all files
- [ ] 11.5 Verify attribution present in all adapted files
- [ ] 11.6 Check MIT license compliance
- [ ] 11.7 Validate with openspec validate adapt-iannuttall-agents

## 12. Plugin Registration

- [ ] 12.1 Verify security plugin in marketplace.json
- [ ] 12.2 Test security plugin installation
- [ ] 12.3 Test design-system agent discovery
- [ ] 12.4 Test typescript skill activation
- [ ] 12.5 Verify all plugins load correctly

## 13. Final Integration

- [ ] 13.1 Create comprehensive test scenarios for each
- [ ] 13.2 Document known limitations
- [ ] 13.3 Create migration notes for future updates
- [ ] 13.4 Update CHANGELOG.md with new capabilities
- [ ] 13.5 Create commit following conventional commit format
