# Security Plugin Spec Deltas

## ADDED Requirements

### Requirement: Comprehensive Security Auditing

The security plugin SHALL provide an agent that performs comprehensive security audits across multiple vulnerability categories.

#### Scenario: Security audit request

- **WHEN** user requests a security audit or vulnerability scan
- **THEN** the security-auditor agent activates
- **AND** analyzes codebase for 90+ vulnerability types
- **AND** generates structured security-report.md

#### Scenario: Super-claude tech stack security

- **WHEN** security audit runs on super-claude project
- **THEN** agent checks TanStack Router security (route guards, auth)
- **AND** checks TanStack Query security (cache poisoning, data exposure)
- **AND** checks Hono API security (middleware, CORS, rate limiting)
- **AND** checks better-auth security (session, tokens, validation)
- **AND** checks Drizzle ORM security (SQL injection, sanitization)
- **AND** checks Base UI accessibility security (ARIA attributes)

#### Scenario: OWASP Top 10 coverage

- **WHEN** security audit completes
- **THEN** report covers all OWASP Top 10 vulnerabilities
- **AND** includes CWE references for findings
- **AND** provides remediation guidance

### Requirement: Security Report Generation

The security plugin SHALL generate actionable security reports with findings and remediation steps.

#### Scenario: Report structure

- **WHEN** security audit completes
- **THEN** generates security-report.md with structured sections
- **AND** includes Executive Summary with risk levels
- **AND** includes Critical Findings with immediate actions
- **AND** includes Detailed Findings by category
- **AND** includes Remediation Roadmap prioritized by severity

#### Scenario: Precision over alarmism

- **WHEN** reporting findings
- **THEN** agent emphasizes verified issues over theoretical risks
- **AND** provides concrete examples from codebase
- **AND** explains impact and exploitability
- **AND** avoids generic security advice

### Requirement: Progressive Disclosure

The security plugin SHALL organize documentation using progressive disclosure for token efficiency.

#### Scenario: Core agent documentation

- **WHEN** security-auditor.md is loaded
- **THEN** core instructions are <100 lines
- **AND** references API_REFERENCE.md for checklists
- **AND** references EXAMPLES.md for scenarios
- **AND** references TECH_STACK.md for super-claude specifics

#### Scenario: Advanced reference loading

- **WHEN** user needs detailed vulnerability checklists
- **THEN** agent loads API_REFERENCE.md on demand
- **AND** provides comprehensive 90+ check listing

### Requirement: Attribution and Licensing

The security plugin SHALL properly attribute original work and maintain license compliance.

#### Scenario: Attribution present

- **WHEN** security-auditor agent is used
- **THEN** YAML frontmatter includes attribution section
- **AND** credits Ian Nuttall as original author
- **AND** references iannuttall/claude-agents repository
- **AND** notes MIT license
- **AND** indicates super-claude adaptations
