/**
 * Type definitions for super-claude-config.json
 *
 * Supports both plugin-level defaults and project-level overrides
 * with deep merge behavior.
 */

/**
 * Skill auto-activation triggers
 */
export type SkillTriggers = {
  /** Literal keywords for case-insensitive matching */
  keywords?: string[];
  /** Regex patterns for intent matching */
  patterns?: string[];
};

/**
 * Complete skill configuration (plugin defaults)
 */
export type SkillConfig = {
  /** Whether this skill is enabled */
  enabled?: boolean;
  /** Auto-activation triggers */
  triggers?: SkillTriggers;
  /** Additional skill-specific settings */
  [key: string]: unknown;
};

/**
 * Partial skill configuration (project overrides)
 */
export type SkillOverride = Partial<SkillConfig>;

/**
 * Hook configuration with plugin-specific settings
 */
export type HookConfig = {
  /** Whether this hook is enabled */
  enabled?: boolean;
  /** Additional hook-specific settings */
  [key: string]: unknown;
};

/**
 * Partial hook configuration (project overrides)
 */
export type HookOverride = Partial<HookConfig>;

/**
 * Plugin-level configuration (plugins/{plugin}/super-claude-config.json)
 */
export type PluginConfig = {
  /** Plugin identifier matching directory name */
  plugin: string;
  /** Skill configurations keyed by skill name */
  skills?: Record<string, SkillConfig>;
  /** Hook configurations keyed by hook name */
  hooks?: Record<string, HookConfig>;
};

/**
 * Project-level configuration (.claude/super-claude-config.json)
 *
 * Structure: { [pluginName]: { skills: {...}, hooks: {...} } }
 */
export type ProjectConfig = Record<
  string,
  {
    skills?: Record<string, SkillOverride>;
    hooks?: Record<string, HookOverride>;
  }
>;

/**
 * Resolved configuration after merging defaults and overrides
 */
export type ResolvedConfig = {
  skills: Record<string, SkillConfig>;
  hooks: Record<string, HookConfig>;
};

/**
 * Configuration loading options
 */
export type ConfigLoaderOptions = {
  /** Current working directory */
  cwd: string;
  /** Plugin name to load config for */
  pluginName: string;
  /** Whether to cache loaded configuration */
  cache?: boolean;
};

/**
 * Legacy skill-rules.json format for backwards compatibility
 */
export type LegacySkillRules = {
  plugin: {
    namespace: string;
    name: string;
  };
  skills: Record<
    string,
    {
      name: string;
      priority?: 'critical' | 'high' | 'medium' | 'low';
      promptTriggers?: {
        keywords?: string[];
        intentPatterns?: string[];
      };
    }
  >;
  overrides?: {
    disabled?: string[];
  };
};
