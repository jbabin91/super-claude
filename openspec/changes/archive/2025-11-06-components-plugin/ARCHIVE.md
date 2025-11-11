# Archive Reason

**Archived Date:** 2025-11-06
**Original Proposal:** components-plugin
**Status:** Partially implemented (5/53 tasks) - Plugin scaffolding completed as "design-system", skills not implemented

## Why Archived

Plugin was renamed to "design-system" during marketplace scaffolding before this proposal was updated. Rather than update 47+ path references (`plugins/components/` → `plugins/design-system/`), we archived and created a new proposal with correct naming.

## What Was Preserved

- Comprehensive spec.md (15 requirements, 30+ scenarios)
- Detailed rationale.md (213 lines of design philosophy)
- 53-step implementation task list
- Three skill definitions:
  - component-generator
  - design-system-orchestrator
  - radix-to-baseui-migrator

## Next Steps

See new proposal: `openspec/changes/design-system-plugin/`

## Context

This proposal contained valuable planning work but was never synchronized with the actual plugin directory structure. The plugin exists at `plugins/design-system/` (already registered in marketplace), but this proposal referenced `plugins/components/` throughout.

Rather than performing a risky find-replace operation across multiple files, we opted to:

1. Archive this proposal with full history
2. Create a new proposal with correct paths
3. Preserve all requirements and rationale for reference

This approach is safer, cleaner, and maintains a clear audit trail.
