# ADR-0006: Progressive Disclosure Pattern for Skills

**Status:** Accepted
**Date:** 2025-10-22
**Deciders:** Project maintainers

## Context

Claude Code skills are loaded into the AI's context window when activated. Token efficiency is critical because:

- Context windows are limited (even with large models)
- Longer context increases cost and latency
- Skills compete for context with user code and conversation
- Frequently-activated skills consume tokens in every session

Requirements:

- Skills must provide enough information to be useful
- Advanced topics shouldn't clutter basic usage
- Token usage should scale with complexity of task
- Common use cases should be fast (low token overhead)
- Rare/advanced use cases should still be supported

The documentation pattern affects:

- Skill activation cost (tokens per activation)
- Response latency (more tokens = slower)
- Developer experience (finding information)
- Skill maintainability (keeping docs concise)

## Decision

**Adopt the Progressive Disclosure pattern for skill documentation:**

1. **SKILL.md** (< 500 lines, ~500-800 words)
   - Core functionality and common use cases
   - Essential instructions and examples
   - Loaded automatically when skill activates
   - Target: < 2,000 tokens

2. **API_REFERENCE.md** (no line limit)
   - Advanced topics and edge cases
   - Detailed parameter documentation
   - Complex scenarios and troubleshooting
   - Loaded only when Claude needs advanced info
   - Not auto-loaded (must reference explicitly)

3. **supporting/** directory (optional)
   - Rationale, examples, tutorials
   - Not loaded unless referenced
   - Can be any size

**Goal:** ~2.5x token savings vs keeping everything in SKILL.md

## Alternatives Considered

### Option 1: Single SKILL.md (Everything in One File)

**Description:**
All documentation in SKILL.md, loaded every time skill activates.

**Pros:**

- Simplest structure (one file)
- No need to manage multiple files
- Everything available immediately
- No risk of missing information

**Cons:**

- **Token cost**: Large files (1,000+ lines) consume 3,000-5,000 tokens
- **Latency**: More tokens = slower responses
- **Signal-to-noise**: Advanced topics clutter common use cases
- **Maintenance**: Harder to keep concise

**Decision:** ❌ Rejected

**Rationale:** Token efficiency is critical for frequently-activated skills. A 3,000-token skill activated in every session wastes context that could be used for user code.

### Option 2: Progressive Disclosure (SKILL.md + API_REFERENCE.md)

**Description:**
Split documentation into essential (SKILL.md) and advanced (API_REFERENCE.md).

**Pros:**

- **Token efficient**: Core usage costs ~800-1,200 tokens
- **Fast activation**: Less content to process
- **Scales with complexity**: Simple tasks stay simple
- **Clear structure**: Common vs advanced is explicit
- **~2.5x savings**: Compared to single-file approach

**Cons:**

- More files to maintain
- Need to decide what goes where
- Risk of information being "hidden" in API_REFERENCE.md
- Claude must explicitly reference API_REFERENCE.md when needed

**Decision:** ✅ Selected

**Rationale:** Token efficiency is essential for skill adoption and performance. The 2.5x token savings outweigh the minor inconvenience of multiple files.

### Option 3: Many Small Files (Extreme Modularity)

**Description:**
Break documentation into many small files (one per feature/command).

```txt
skills/component-generator/
├── SKILL.md (navigation only)
├── basic-usage.md
├── props.md
├── variants.md
├── accessibility.md
├── testing.md
└── troubleshooting.md
```

**Pros:**

- Maximum granularity
- Load only what's needed
- Theoretically most token-efficient

**Cons:**

- **Complexity**: Too many files to manage
- **Fragmentation**: Hard to find information
- **Overhead**: Claude must know which file to load
- **Navigation burden**: More decisions about what to load

**Decision:** ❌ Rejected

**Rationale:** Over-optimization. The two-file approach (SKILL.md + API_REFERENCE.md) provides sufficient token savings without excessive complexity.

## Consequences

### Positive

- **Token efficiency**: ~2.5x token savings on common use cases
- **Faster responses**: Less context to process = lower latency
- **Cost savings**: Lower token usage = lower API costs
- **Better focus**: SKILL.md stays focused on common use cases
- **Scalability**: Skills can grow without bloating core docs
- **Clearer structure**: Obvious where to find basic vs advanced info

### Negative

- **Two files to maintain**: More work than single file
- **Risk of omission**: Important info might be relegated to API_REFERENCE.md
- **Discovery**: Users might not know API_REFERENCE.md exists
- **Decision overhead**: Authors must decide what goes where

### Neutral

- **Documentation structure**: Need consistent pattern across all skills
- **Reference pattern**: Claude must learn to reference API_REFERENCE.md when needed
- **Skill templates**: skill-creator must generate correct structure

## Implementation Notes

**How will this be enforced?**

- skill-creator generates SKILL.md + API_REFERENCE.md templates
- Documentation guidelines specify < 500 lines for SKILL.md
- Code review checks SKILL.md length
- skill-validator can warn if SKILL.md > 500 lines

**What goes in SKILL.md:**

- Overview and purpose
- Common use cases (80% of usage)
- Basic examples
- Essential parameters
- Quick reference

**What goes in API_REFERENCE.md:**

- Advanced use cases (20% of usage)
- All parameter documentation
- Edge cases and troubleshooting
- Complex scenarios
- Performance tuning
- Migration guides

**Reference pattern:**

```markdown
<!-- In SKILL.md -->

For advanced configuration, see API_REFERENCE.md.

<!-- Claude can then read API_REFERENCE.md if needed -->
```

**When does this take effect?**

- Immediately for new skills
- Existing skills should be refactored when updated

**What needs to change to comply?**

- Split existing large SKILL.md files into SKILL.md + API_REFERENCE.md
- skill-creator generates both files
- Documentation guidelines updated
- skill-validator checks file sizes

**Target metrics:**

- SKILL.md: < 500 lines (~500-800 words, ~800-1,200 tokens)
- API_REFERENCE.md: No limit (but should be well-organized)
- Total documentation: Can be any size (as long as SKILL.md is concise)

## References

**Related ADRs:**

- None yet

**OpenSpec Proposals:**

- [meta-plugin](../../../openspec/changes/meta-plugin/) - skill-creator generates progressive disclosure structure

**External Resources:**

- [Progressive Disclosure in UX](https://www.nngroup.com/articles/progressive-disclosure/)
- [Token Optimization for LLMs](https://platform.openai.com/docs/guides/prompt-engineering)

## Notes

**Why ~500 lines for SKILL.md?**

Based on analysis:

- **500 lines** ≈ 500-800 words ≈ 800-1,200 tokens
- **1,000 lines** ≈ 1,000-1,500 words ≈ 1,500-2,500 tokens
- **2,000 lines** ≈ 2,000-3,000 words ≈ 3,000-5,000 tokens

500 lines is the sweet spot:

- Enough for comprehensive basic usage
- Low enough to keep token cost reasonable
- Familiar limit (similar to SKILL.md best practices)

**Comparison to MCP Servers:**

MCP servers (Model Context Protocol) are persistent processes that stay in memory. Progressive disclosure skills:

- **Load on demand** (not persistent)
- **Unload after use** (no permanent context cost)
- **~2.5x more efficient** than keeping full docs in memory

**Real-world example:**

A component-generator skill with progressive disclosure:

- **SKILL.md** (450 lines, ~700 words, ~1,000 tokens)
  - Basic component generation
  - Common props and variants
  - Quick examples

- **API_REFERENCE.md** (1,200 lines, ~2,000 words, ~3,000 tokens)
  - All parameter documentation
  - Advanced variants (size, color, etc.)
  - Accessibility details
  - Testing patterns
  - Troubleshooting

**Result:** 1,000 tokens for common use (vs 4,000 tokens for single file) = 4x savings

This pattern makes skills sustainable as the project grows.
