/**
 * Type definitions for Claude Code Skill Auto-Activation System
 *
 * @module skill-rules
 * @version 1.0.0
 *
 * This module provides TypeScript interfaces for configuring skill auto-activation
 * rules in Claude Code plugins. The system supports both plugin-level rules and
 * project-level overrides.
 *
 * @see {@link https://github.com/jbabin91/super-claude} for documentation
 */

/**
 * Priority levels for skill activation suggestions.
 *
 * - `critical`: Must-use skills that are essential for the task (shown with ⚠️)
 * - `high`: Strongly recommended skills (shown with 📚)
 * - `medium`: Moderately useful skills (shown with 💡)
 * - `low`: Optional skills that may be helpful (shown with 💬)
 */
export type Priority = 'critical' | 'high' | 'medium' | 'low';

/**
 * Enforcement strategy for skill activation.
 *
 * - `suggest`: Show skill as a recommendation (default, MVP)
 * - `block`: Block action until skill is used (future enhancement)
 * - `warn`: Show warning if skill not used (future enhancement)
 */
export type Enforcement = 'suggest' | 'block' | 'warn';

/**
 * Type of skill classification.
 *
 * - `domain`: Domain-specific skills for development tasks
 * - `guardrail`: Safety/quality enforcement skills (future)
 */
export type SkillType = 'domain' | 'guardrail';

/**
 * Prompt trigger configuration for keyword and pattern matching.
 *
 * The hook uses two matching strategies:
 * 1. **Keywords**: Case-insensitive literal string matching
 * 2. **Intent Patterns**: Regex patterns with case-insensitive flag
 *
 * @example
 * ```typescript
 * {
 *   keywords: ['create skill', 'skill development'],
 *   intentPatterns: ['(create|add).*?skill', 'how to.*?skill']
 * }
 * ```
 */
export type PromptTriggers = {
  /**
   * Case-insensitive literal keywords to match in prompts.
   *
   * Example: `["create skill"]` matches "I want to create skill"
   */
  keywords?: string[];

  /**
   * Regex patterns for intent-based matching (case-insensitive).
   *
   * Example: `["(create|add).*?skill"]` matches "How do I add a new skill?"
   */
  intentPatterns?: string[];
};

/**
 * Configuration for a single skill's activation rules.
 *
 * Each skill defines:
 * - Type and enforcement strategy
 * - Priority level for sorting suggestions
 * - Trigger conditions (keywords and/or patterns)
 *
 * @example
 * ```typescript
 * {
 *   type: 'domain',
 *   enforcement: 'suggest',
 *   priority: 'high',
 *   description: 'Generate new Claude Code skills with proper structure',
 *   promptTriggers: {
 *     keywords: ['create skill', 'skill development'],
 *     intentPatterns: ['(create|add).*?skill']
 *   }
 * }
 * ```
 */
export type SkillConfig = {
  /**
   * Type of skill (domain-specific or guardrail).
   */
  type: SkillType;

  /**
   * Enforcement strategy when skill matches.
   *
   * MVP only supports 'suggest'. 'block' and 'warn' are future enhancements.
   */
  enforcement: Enforcement;

  /**
   * Priority level affects sorting and display of suggestions.
   *
   * Higher priorities appear first in the output.
   */
  priority: Priority;

  /**
   * Optional human-readable description of when to use this skill.
   *
   * Used for debugging and documentation, not shown to Claude.
   */
  description?: string;

  /**
   * Trigger conditions for activating this skill.
   *
   * At least one keyword or pattern should be provided.
   */
  promptTriggers: PromptTriggers;

  // Future enhancements (not in MVP):
  // fileTriggers?: FileTriggers;
  // blockMessage?: string;
  // requires?: string[];
  // suggestsWith?: string[];
};

/**
 * Plugin-level skill activation rules.
 *
 * Each plugin defines its own `skill-rules.json` file with metadata and
 * skill configurations. The namespace prevents conflicts when multiple
 * plugins have skills with the same name.
 *
 * **Location:** `plugins/{plugin-name}/skills/skill-rules.json`
 *
 * @example
 * ```typescript
 * {
 *   plugin: {
 *     name: 'claude-tools',
 *     version: '1.0.0',
 *     namespace: 'claude'
 *   },
 *   skills: {
 *     'skill-creator': {
 *       type: 'domain',
 *       enforcement: 'suggest',
 *       priority: 'high',
 *       promptTriggers: {
 *         keywords: ['create skill'],
 *         intentPatterns: ['(create|add).*?skill']
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type PluginSkillRules = {
  /**
   * Plugin metadata for identification and conflict prevention.
   */
  plugin: {
    /**
     * Human-readable plugin name (e.g., 'claude-tools').
     */
    name: string;

    /**
     * Semantic version of the plugin rules.
     */
    version: string;

    /**
     * Unique namespace to prevent skill name conflicts across plugins.
     *
     * Skills are referenced as `{namespace}/{skill-name}`.
     * Example: 'claude' → skill referenced as 'claude/skill-creator'
     */
    namespace: string;
  };

  /**
   * Map of skill names to their activation configurations.
   *
   * Keys are skill names (without namespace prefix).
   * Values are SkillConfig objects.
   */
  skills: Record<string, SkillConfig>;
};

/**
 * Global configuration options affecting all skills.
 *
 * Applied at the project level to customize activation behavior.
 */
export type GlobalConfig = {
  /**
   * Maximum number of skill suggestions to show per prompt.
   *
   * When more skills match, only the top N (by priority) are shown.
   *
   * @default undefined (show all matches)
   */
  maxSkillsPerPrompt?: number;

  /**
   * Minimum priority threshold for showing suggestions.
   *
   * Skills below this priority are filtered out.
   *
   * @default undefined (no filtering by priority)
   */
  priorityThreshold?: Priority;
};

/**
 * Project-level overrides for skill activation rules.
 *
 * Optional file that allows users to customize plugin-defined rules:
 * - Override specific skill configurations
 * - Disable unwanted skills
 * - Apply global filtering options
 *
 * **Location:** `.claude/skills/skill-rules.json`
 *
 * **Precedence:** Project overrides > Plugin defaults
 *
 * @example
 * ```typescript
 * {
 *   version: '1.0',
 *   overrides: {
 *     'claude/skill-creator': {
 *       priority: 'critical',
 *       promptTriggers: {
 *         keywords: ['create skill', 'scaffold skill']
 *       }
 *     }
 *   },
 *   disabled: ['claude/old-skill', 'another/deprecated-skill'],
 *   global: {
 *     maxSkillsPerPrompt: 3,
 *     priorityThreshold: 'high'
 *   }
 * }
 * ```
 */
export type ProjectSkillRules = {
  /**
   * Version of the override schema.
   *
   * Used for future compatibility if schema changes.
   */
  version: string;

  /**
   * Partial overrides for specific skills.
   *
   * Keys MUST include namespace (e.g., 'claude/skill-creator').
   * Values are partial SkillConfig objects that merge with plugin defaults.
   *
   * **Merge Strategy (MVP):** Shallow merge (object spread)
   * - Entire nested objects are replaced, not merged
   * - Example: Overriding promptTriggers replaces the entire object
   */
  overrides: Record<string, Partial<SkillConfig>>;

  /**
   * Array of skill identifiers to disable completely.
   *
   * Skills in this array will not appear in suggestions even if they match.
   *
   * Keys MUST include namespace (e.g., 'claude/old-skill').
   */
  disabled: string[];

  /**
   * Global configuration affecting all skills.
   *
   * Optional settings for filtering and limiting suggestions.
   */
  global?: GlobalConfig;
};

/**
 * Result object when a skill matches a user prompt.
 *
 * Used internally by the hook to track matches before formatting output.
 */
export type MatchedSkill = {
  /**
   * Fully qualified skill identifier with namespace.
   *
   * Format: `{namespace}/{skill-name}`
   * Example: `'claude/skill-creator'`
   */
  id: string;

  /**
   * Skill name without namespace prefix.
   */
  name: string;

  /**
   * Namespace of the plugin that defined this skill.
   */
  namespace: string;

  /**
   * Skill configuration (after merging plugin rules and overrides).
   */
  config: SkillConfig;

  /**
   * How this skill was matched.
   *
   * - `keyword`: Matched via literal keyword
   * - `intent`: Matched via regex pattern
   */
  matchType: 'keyword' | 'intent';

  /**
   * The specific keyword or pattern that triggered the match.
   *
   * Useful for debugging and analytics.
   */
  matchedBy: string;
};

/**
 * Hook input structure from Claude Code.
 *
 * Passed via stdin when UserPromptSubmit hook executes.
 *
 * @see {@link https://docs.anthropic.com/en/docs/claude-code/hooks}
 */
export type HookInput = {
  /**
   * Unique session identifier.
   */
  session_id: string;

  /**
   * Path to the conversation transcript file.
   */
  transcript_path: string;

  /**
   * Current working directory where Claude Code is running.
   */
  cwd: string;

  /**
   * Permission mode for the session.
   */
  permission_mode: string;

  /**
   * The user's prompt text to analyze.
   */
  prompt: string;
};

/**
 * Hook output structure for skill suggestions.
 *
 * Written to stdout for Claude Code to inject into the conversation.
 *
 * Not directly used by TypeScript (formatted as string), but documented
 * here for reference.
 */
export type HookOutput = {
  /**
   * Formatted text to prepend to the user's prompt.
   *
   * Example:
   * ```
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * 🎯 SKILL ACTIVATION CHECK
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   *
   * 📚 RECOMMENDED SKILLS:
   *   → skill-creator
   *   → hook-creator
   *
   * ACTION: Use Skill tool BEFORE responding
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * ```
   */
  message: string;
};
