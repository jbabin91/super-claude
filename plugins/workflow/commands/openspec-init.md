# OpenSpec Init Command

Initialize OpenSpec directory structure in your project without duplicating slash commands.

## Purpose

Creates the `openspec/` directory structure (specs, changes, AGENTS.md, project.md) while avoiding conflicts with the workflow plugin's enhanced OpenSpec commands.

## Usage

This command should be run **once per project** when you first want to use OpenSpec.

## What This Command Does

1. **Validates openspec CLI is installed**
   - Check if `openspec` command is available
   - If not, provide installation instructions

2. **Runs `openspec init --tools none`**
   - Creates `openspec/` directory structure
   - Creates `openspec/AGENTS.md` (OpenSpec workflow instructions)
   - Creates `openspec/project.md` (project context template)
   - Creates `openspec/changes/` (for proposals)
   - Creates `openspec/specs/` (for specifications)
   - Creates root `AGENTS.md` (agent instructions)
   - Does NOT create `.claude/commands/` (prevents duplication)

3. **Explains next steps**
   - How to fill out `openspec/project.md`
   - How to use OpenSpec slash commands from this plugin
   - How to create first change proposal

## Why `--tools none`?

The workflow plugin provides **enhanced OpenSpec commands** with additional context and customization:

- `/openspec:proposal` - Create new change proposals
- `/openspec:work` - Start working on a proposal with full context loading
- `/openspec:apply` - Implement approved proposals with task tracking
- `/openspec:checkpoint` - Save progress and context
- `/openspec:status` - Show current proposal status
- `/openspec:done` - Complete and prepare for archiving
- `/openspec:archive` - Archive completed changes

Using `--tools none` prevents OpenSpec CLI from creating duplicate basic commands, ensuring you get the full enhanced experience from this plugin.

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

# Get current working directory
PROJECT_DIR=$(pwd)

# Check if already initialized
if [ -d "$PROJECT_DIR/openspec" ]; then
  echo "Warning: openspec/ directory already exists in $PROJECT_DIR"
  echo ""
  read -p "Reinitialize? This will update instruction files. (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Initialization cancelled"
    exit 0
  fi
fi

# Initialize OpenSpec without tool-specific commands
echo "Initializing OpenSpec in: $PROJECT_DIR"
echo ""
openspec init "$PROJECT_DIR" --tools none

# Check if successful
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ OpenSpec initialized successfully!"
  echo ""
  echo "📂 Created structure:"
  echo "   openspec/"
  echo "   ├── AGENTS.md       # OpenSpec workflow instructions"
  echo "   ├── project.md      # Project context (fill this out!)"
  echo "   ├── changes/        # Change proposals"
  echo "   └── specs/          # Specifications"
  echo ""
  echo "🎯 Next steps:"
  echo ""
  echo "1. Fill out project context:"
  echo "   'Please read openspec/project.md and help me fill it out"
  echo "    with details about my project, tech stack, and conventions'"
  echo ""
  echo "2. Create your first proposal:"
  echo "   'I want to add [FEATURE]. Please create an OpenSpec change"
  echo "    proposal using /openspec:proposal'"
  echo ""
  echo "3. Available commands from workflow plugin:"
  echo "   /openspec:proposal  - Create new proposal"
  echo "   /openspec:work      - Start working on proposal"
  echo "   /openspec:apply     - Implement approved proposal"
  echo "   /openspec:checkpoint - Save progress"
  echo "   /openspec:status    - Show current status"
  echo "   /openspec:done      - Mark proposal complete"
  echo "   /openspec:archive   - Archive completed proposal"
  echo ""
else
  echo ""
  echo "❌ OpenSpec initialization failed"
  echo "Check the error messages above"
  exit 1
fi
```

## Notes

- **Run once per project** - Not needed in every session
- **Safe to re-run** - Will ask before overwriting existing structure
- **No conflicts** - Won't create duplicate commands (uses `--tools none`)
- **Enhanced commands** - You get our customized OpenSpec workflow from the plugin
