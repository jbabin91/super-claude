import { type } from 'arktype';

/**
 * Common patterns for skill frontmatter validation
 */
const patterns = {
  // Skill name should be kebab-case (lowercase letters, numbers, hyphens only)
  // Claude Code requires max 64 characters
  kebabCase: (s: string) =>
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length <= 64,
  // Semantic versioning
  semver: (s: string) =>
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(s),
  // Description max length per Claude Code docs
  maxDescription: (s: string) => s.length <= 1024,
};

/**
 * Tool requirements schema
 */
const requiresSchema = type({
  'tools?': 'string[]', // External dependencies (e.g., ["git", "npm"])
  'plugins?': 'string[]', // Required plugins
});

/**
 * Skill activation triggers schema
 */
const triggersSchema = type({
  'keywords?': 'string[]', // Keywords that activate the skill
  'patterns?': 'string[]', // Regex patterns for activation
  'contexts?': 'string[]', // Context types (e.g., development, testing)
});

/**
 * Valid model options
 */
const modelSchema = type('"sonnet" | "haiku" | "opus"');

/**
 * Skill frontmatter schema for SKILL.md files
 *
 * Based on Claude Code Skills documentation:
 * https://code.claude.com/docs/en/skills.md
 *
 * CLAUDE CODE OFFICIAL FIELDS (recognized by Claude Code):
 * - name (required): max 64 chars, lowercase/numbers/hyphens only
 * - description (required): max 1024 chars, explains what skill does and when to use it
 * - allowed-tools (optional): restricts which tools Claude can access when skill is active
 *
 * EXTENDED FIELDS (not recognized by Claude Code, but useful for organization):
 * - version: track significant skill changes (our extension) - optional; omit for stable skills or initial versions
 * - category: organize skills by type (our extension)
 * - tags: discovery and searchability (our extension)
 * - model: preferred model selection (our extension)
 * - requires: external dependencies (our extension)
 * - triggers: auto-activation configuration (our extension)
 */
export const skillFrontmatterSchema = type({
  // Required fields (Claude Code official)
  name: type('string', ':', patterns.kebabCase),
  description: type('string', ':', patterns.maxDescription),

  // Optional field (Claude Code official)
  'allowed-tools?': 'string[]', // Restricts tools when skill is active

  // Extended fields (not recognized by Claude Code, but useful)
  'version?': type('string', ':', patterns.semver),
  'category?': 'string', // Skill category (e.g., workflow-automation, meta)
  'tags?': 'string[]', // Tags for discovery
  'model?': modelSchema, // Preferred model: sonnet, haiku, or opus
  'requires?': requiresSchema, // External dependencies
  'triggers?': triggersSchema, // Auto-activation configuration
});
// NOTE: We don't use .onUndeclaredKey('reject') here because our simple YAML parser
// may incorrectly extract fields from multiline descriptions (e.g., "Use when: ..." becomes a key).
// Skills are documentation files, not runtime configs, so extra fields are harmless.

export type SkillFrontmatter = typeof skillFrontmatterSchema.infer;
