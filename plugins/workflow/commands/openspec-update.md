# OpenSpec Update Command

Update OpenSpec instruction files to the latest version without affecting slash commands.

## Purpose

Refreshes OpenSpec workflow documentation (AGENTS.md files) when the OpenSpec CLI is updated, ensuring you have the latest best practices and patterns.

## Usage

Run this command after updating the OpenSpec CLI to get the latest instruction files:

```bash
# Update OpenSpec CLI first
npm update -g @jsdocs-io/openspec

# Then refresh instruction files
/openspec-update
```

## What This Command Does

1. **Validates openspec CLI is installed**
   - Checks if `openspec` command is available
   - Shows current version

2. **Runs `openspec update`**
   - Updates `openspec/AGENTS.md` (OpenSpec workflow instructions)
   - Updates root `AGENTS.md` (if it exists)
   - **Does NOT touch slash commands** (we maintain our own enhanced versions)

3. **Shows what was updated**
   - Lists files that changed
   - Explains what's new (if possible)

## Safety

This command is **safe to run repeatedly**:

- ✅ Updates instruction files only
- ✅ Won't override workflow plugin commands
- ✅ Won't modify your specs or changes
- ✅ Won't affect project configuration

## When to Run

- After updating OpenSpec CLI to a new version
- When you want the latest OpenSpec patterns and best practices
- After reading OpenSpec release notes mentioning instruction updates

## Implementation

```bash
# Check if openspec is installed
if ! command -v openspec &> /dev/null; then
  echo "Error: openspec CLI not found"
  echo ""
  echo "Install with:"
  echo "  npm install -g @jsdocs-io/openspec"
  echo "  # or"
  echo "  pnpm add -g @jsdocs-io/openspec"
  echo "  # or"
  echo "  yarn global add @jsdocs-io/openspec"
  exit 1
fi

# Show current version
OPENSPEC_VERSION=$(openspec --version 2>&1 || echo "unknown")
echo "OpenSpec CLI version: $OPENSPEC_VERSION"
echo ""

# Get current working directory
PROJECT_DIR=$(pwd)

# Check if initialized
if [ ! -d "$PROJECT_DIR/openspec" ]; then
  echo "Error: OpenSpec not initialized in this project"
  echo ""
  echo "Run /openspec-init first to set up OpenSpec"
  exit 1
fi

# Update instruction files
echo "Updating OpenSpec instruction files in: $PROJECT_DIR"
echo ""
openspec update "$PROJECT_DIR"

# Check if successful
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ OpenSpec instruction files updated successfully!"
  echo ""
  echo "📝 Updated files:"
  echo "   openspec/AGENTS.md  # Latest workflow instructions"
  echo "   AGENTS.md           # Updated agent guidance"
  echo ""
  echo "💡 Note:"
  echo "   Slash commands (/openspec:*) are managed by the workflow plugin"
  echo "   and are NOT affected by this update. You're using enhanced versions"
  echo "   customized for Claude Code."
  echo ""
else
  echo ""
  echo "❌ Update failed"
  echo "Check the error messages above"
  exit 1
fi
```

## Notes

- **Safe to run anytime** - Won't break existing work
- **No command conflicts** - Won't override workflow plugin commands
- **Version aware** - Get instructions matching your CLI version
- **Preserves customization** - Your specs and changes untouched
