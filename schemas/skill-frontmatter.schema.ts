import { type } from 'arktype';

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
 */
export const skillFrontmatterSchema = type({
  // Required fields
  name: 'string', // Skill identifier (kebab-case)
  version: 'string', // Semantic versioning (e.g., "1.0.0")
  description: 'string', // What the skill does, when to use it, activation triggers

  // Optional fields
  'category?': 'string', // Skill category (e.g., workflow-automation, meta)
  'tags?': 'string[]', // Tags for discovery
  'model?': modelSchema, // Preferred model: sonnet, haiku, or opus
  'requires?': requiresSchema, // External dependencies
  'triggers?': triggersSchema, // Auto-activation configuration
});

export type SkillFrontmatter = typeof skillFrontmatterSchema.infer;
