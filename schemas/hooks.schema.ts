import { type } from 'arktype';

/**
 * Hook types
 */
const hookTypeSchema = type('"command" | "prompt"');

/**
 * Individual hook configuration
 */
const hookConfigSchema = type({
  type: hookTypeSchema,
  'command?': 'string', // Required if type is "command"
  'prompt?': 'string', // Required if type is "prompt"
  'timeout?': 'number', // Optional timeout in seconds
});

/**
 * Hook group configuration
 * Contains array of hooks with optional matcher
 */
const hookGroupSchema = type({
  'matcher?': 'string', // Pattern for PreToolUse/PostToolUse (case-sensitive)
  hooks: hookConfigSchema.array(),
});

/**
 * Valid hook event types
 */
const _hookEventTypes = [
  'SessionStart',
  'SessionEnd',
  'UserPromptSubmit',
  'PreToolUse',
  'PostToolUse',
  'Stop',
  'SubagentStop',
  'Notification',
  'PreCompact',
] as const;

export type HookEventType = (typeof _hookEventTypes)[number];

/**
 * Hooks configuration schema for hooks.json or inline hooks
 *
 * Based on Claude Code Hooks Reference:
 * https://code.claude.com/docs/en/hooks.md
 */
export const hooksSchema = type({
  hooks: type({
    'SessionStart?': hookGroupSchema.array(),
    'SessionEnd?': hookGroupSchema.array(),
    'UserPromptSubmit?': hookGroupSchema.array(),
    'PreToolUse?': hookGroupSchema.array(),
    'PostToolUse?': hookGroupSchema.array(),
    'Stop?': hookGroupSchema.array(),
    'SubagentStop?': hookGroupSchema.array(),
    'Notification?': hookGroupSchema.array(),
    'PreCompact?': hookGroupSchema.array(),
  }),
  'description?': 'string', // Optional description field
});

export type HooksConfig = typeof hooksSchema.infer;
