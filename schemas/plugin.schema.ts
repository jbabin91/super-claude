import { type } from 'arktype';

/**
 * Author information schema
 */
const authorSchema = type({
  name: 'string',
  'email?': 'string',
  'url?': 'string',
});

/**
 * Plugin manifest schema for .claude-plugin/plugin.json
 *
 * Based on Claude Code Plugins Reference:
 * https://code.claude.com/docs/en/plugins-reference.md
 */
export const pluginSchema = type({
  // Required fields
  name: 'string',

  // Metadata fields
  'version?': 'string', // Semantic versioning (e.g., "1.0.0")
  'description?': 'string',
  'author?': authorSchema,
  'homepage?': 'string',
  'repository?': 'string',
  'license?': 'string',
  'keywords?': 'string[]',

  // Component path fields (string or array of strings)
  'commands?': 'string | string[]',
  'agents?': 'string | string[]',
  'skills?': 'string | string[]',
  'subAgents?': 'string | string[]',

  // Hooks: can be string path or inline object
  'hooks?': 'string | object',

  // MCP servers: can be string path or inline object
  'mcpServers?': 'string | object',
});

export type PluginManifest = typeof pluginSchema.infer;
