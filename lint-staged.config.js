/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  // Lint markdown files first
  '**/*.{md,mdx}': ['pnpm run lint:fix'],

  // Format files
  '*.{ts,tsx,js,jsx,cjs,mjs,json,md,mdx,yml,yaml}': (files) =>
    `pnpm prettier -uwl --cache ${files.join(' ')}`,
};
