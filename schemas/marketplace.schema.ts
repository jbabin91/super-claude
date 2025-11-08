import { type } from 'arktype';

/**
 * Owner/Author information schema
 */
const ownerSchema = type({
  name: 'string',
  'email?': 'string',
  'url?': 'string',
});

/**
 * Marketplace metadata schema
 */
const metadataSchema = type({
  version: 'string', // Semantic versioning
  description: 'string',
  'repository?': 'string',
  'homepage?': 'string',
  'license?': 'string',
});

/**
 * Plugin entry schema
 */
const pluginEntrySchema = type({
  name: 'string', // Plugin identifier (must match plugin.json name)
  source: 'string', // Relative path to plugin directory
  description: 'string',
  version: 'string', // Semantic versioning
  'category?': 'string',
  'keywords?': 'string[]',
});

/**
 * Marketplace manifest schema for .claude-plugin/marketplace.json
 *
 * Based on Claude Code Plugin Marketplace documentation:
 * https://code.claude.com/docs/en/plugin-marketplaces.md
 */
export const marketplaceSchema = type({
  name: 'string', // Marketplace identifier
  owner: ownerSchema,
  metadata: metadataSchema,
  plugins: pluginEntrySchema.array(),
  '$schema?': 'string', // Optional JSON Schema reference
});

export type MarketplaceManifest = typeof marketplaceSchema.infer;
