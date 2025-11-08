import { type } from 'arktype';

/**
 * Common patterns matching .claude-plugin/marketplace.schema.json
 */
const patterns = {
  // Marketplace/plugin name must be kebab-case
  kebabCase: (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s),
  // Semantic versioning
  semver: (s: string) =>
    /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(s),
  // Basic email format
  email: (s: string) =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      s,
    ),
  // Basic URL format
  url: (s: string) => /^https?:\/\/.+$/.test(s),
};

/**
 * Owner/Author information schema
 */
const ownerSchema = type({
  name: 'string',
  'email?': type('string', ':', patterns.email),
  'url?': type('string', ':', patterns.url),
});

/**
 * Marketplace metadata schema
 */
const metadataSchema = type({
  version: type('string', ':', patterns.semver),
  description: 'string',
  'repository?': type('string', ':', patterns.url),
  'homepage?': type('string', ':', patterns.url),
  'license?': 'string',
});

/**
 * Plugin entry schema
 */
const pluginEntrySchema = type({
  name: type('string', ':', patterns.kebabCase),
  source: 'string', // Can be relative path or GitHub repo format
  description: 'string',
  version: type('string', ':', patterns.semver),
  'category?': 'string',
  'keywords?': 'string[]',
});

/**
 * Marketplace manifest schema for .claude-plugin/marketplace.json
 *
 * Based on .claude-plugin/marketplace.schema.json
 * Reference: https://code.claude.com/docs/en/plugin-marketplaces.md
 */
export const marketplaceSchema = type({
  name: type('string', ':', patterns.kebabCase),
  owner: ownerSchema,
  metadata: metadataSchema,
  plugins: pluginEntrySchema.array(),
  '$schema?': 'string', // Optional JSON Schema reference (ignored by Claude)
});

export type MarketplaceManifest = typeof marketplaceSchema.infer;
