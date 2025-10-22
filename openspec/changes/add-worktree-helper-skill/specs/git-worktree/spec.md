# Git Worktree Capability

## ADDED Requirements

### Requirement: Worktree Creation

The skill SHALL automate git worktree creation for parallel development.

#### Scenario: Create worktree for new branch

- **WHEN** user wants to work on new feature in parallel
- **THEN** the skill creates worktree with: `git worktree add <path> -b <branch>`
- **AND** uses consistent naming convention
- **AND** navigates to new worktree

#### Scenario: Create worktree for existing branch

- **WHEN** user wants to check out existing branch in parallel
- **THEN** the skill creates worktree for existing branch
- **AND** pulls latest changes

### Requirement: Worktree Management

The skill SHALL manage and list existing worktrees.

#### Scenario: List worktrees

- **WHEN** user requests worktree status
- **THEN** the skill runs `git worktree list`
- **AND** shows all active worktrees with branches

#### Scenario: Worktree cleanup

- **WHEN** worktree no longer needed
- **THEN** the skill removes with: `git worktree remove <path>`
- **AND** handles uncommitted changes safely

### Requirement: Parallel Development Workflow

The skill SHALL guide parallel development using worktrees.

#### Scenario: Switch between worktrees

- **WHEN** user wants to switch contexts
- **THEN** the skill suggests navigating to worktree directory
- **AND** provides status of each worktree

### Requirement: Context-Aware Activation

The skill SHALL activate for worktree tasks.

#### Scenario: Keyword trigger

- **WHEN** conversation mentions "worktree", "parallel development", "multiple branches"
- **THEN** the skill activates
