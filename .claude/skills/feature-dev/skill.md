---
name: feature-dev-workflow
description: "Use this skill whenever a new feature or UI change is being implemented end-to-end. Triggers: any request that involves adding, modifying, or removing product functionality — especially when the task has design implications, requires planning documents, or involves GitHub issue/branch management. Covers the full lifecycle: design review → spec writing → implementation planning → issue/branch creation → sub-agent driven implementation → iterative review → PR. Do NOT skip phases even if the feature feels small."
---

# Feature Development Workflow

## Core Philosophy

Every feature, regardless of size, goes through the same structured lifecycle.  
Each phase acts as a **quality gate** — do not proceed to the next phase until the current one is clean.

**When in doubt, ask.** If any requirement, design intent, scope boundary, or edge case behavior is unclear at any point in the workflow, stop and ask the user before proceeding. Never assume or invent an answer to resolve ambiguity. A wrong assumption that gets built upon compounds into larger rework — a single clarifying question prevents it.

---

## Phase 0 — Design Review

**Before writing any code or document**, check the design source of truth (e.g., Figma).

- Identify the exact component(s) involved in this feature.
- Check visual states: default, hover, active, focus, disabled, error.
- Note any conditional visibility, animation, or interaction behavior specified.
- If designs are missing or ambiguous, flag the gap explicitly before continuing.

> Principle: Code should describe intent captured in design — not invent it.

---

## Phase 1 — Context & Edge Case Analysis

Before documenting, think through the full scope:

- What are the different **states or modes** the feature must handle? (e.g., different user roles, different data contexts, different view levels)
- Are there **implicit requirements** not stated in the task description?
- What **existing behaviors** must be preserved or are at risk of regression?
- List all edge cases explicitly. Each one must be addressed in the spec.

---

## Phase 2 — Document-Driven Planning

Write two documents in sequence, and do not start implementation until both pass review.

### 2-1. Spec Document

Cover all of the following:

- Feature summary and user-facing goal
- Acceptance criteria (testable, specific conditions for "done")
- UI states and transitions (with design references)
- Edge cases and how each is handled
- Out-of-scope items (explicit non-goals)

### 2-2. Implementation Plan Document

Cover all of the following:

- Component/module breakdown
- State management approach
- Data flow (props, context, API, store)
- Files to create / modify / delete
- Potential side effects or risks

### Review Loop (per document)

After each document is written:

1. Run `review` skill on the document.
2. If **critical** or **important** issues are found → fix and re-run review.
3. Repeat until only **minor** or **suggestion**-level issues remain.
4. Only then proceed to the next document or phase.

---

## Phase 3 — GitHub Issue & Branch Strategy

Create issues and branches **after** both documents are approved.

### Issue Creation

- Create one **parent GitHub issue** for the feature, linked to the spec.
- If the work volume is large, break it into **sub-issues** under the parent.
- Each sub-issue should be independently reviewable and deployable.

### Branch Hierarchy

```
main
└── feature/parent-feature-name       ← branched from main
    ├── feature/sub-issue-a           ← branched from parent feature branch
    └── feature/sub-issue-b           ← branched from parent feature branch
```

- The **parent branch** is always cut from `main`.
- **Sub-branches** are always cut from the parent branch, never directly from `main`.
- Branch names must correspond 1:1 with their GitHub issue.

---

## Phase 4 — Sub-Agent Driven Implementation & Per-Issue Review

Implementation is delegated to **sub-agents**, one per issue. The orchestrator (this agent) coordinates, does not directly write production code.

### Sub-Agent Execution Model

For each issue, the orchestrator:

1. **Spawns a sub-agent** scoped strictly to that issue.
2. Provides the sub-agent with:
   - The approved spec document
   - The approved implementation plan
   - The relevant branch name
   - The exact scope of this issue (files, components, behaviors)
3. The sub-agent implements and reports back.
4. The orchestrator **reviews** the sub-agent's output using the `review` skill.
5. If **critical** or **important** issues are found → the orchestrator instructs the sub-agent to fix and re-reviews.
6. Repeat until clean.
7. The orchestrator creates a **Pull Request** targeting the parent branch (or `main` for top-level issues).
8. **Do not merge** — the user handles all merges.

### Sub-Agent Constraints

Each sub-agent must:

- Work **only within the scope** of its assigned issue — no scope creep into other issues.
- Not modify files owned by a sibling sub-agent's issue.
- Treat the spec and implementation plan as **immutable truth** — deviation requires escalation to the orchestrator, not unilateral decisions.

### Why Sub-Agent Driven?

| Concern | Benefit |
|---------|---------|
| Isolation | Each issue's context is contained; no cross-contamination |
| Parallelism | Independent issues can be delegated concurrently when branches allow |
| Reviewability | Smaller, focused changesets are easier to review and reason about |
| Accountability | Clear ownership of each change per agent |

### Review Scope per Issue

When reviewing sub-agent output, the orchestrator checks:

- Does the implementation match the spec and implementation plan?
- Are all edge cases from Phase 1 handled?
- Did the sub-agent stay within its assigned scope?
- Is the code readable, predictable, and cohesive? (See coding standards below)

---

## Coding Standards (apply throughout)

| Principle | What it means |
|-----------|--------------|
| **Readability** | Code is easy to read without needing to trace execution |
| **Predictability** | Function/component behavior is clear from its name and signature alone |
| **Cohesion** | Code that changes together lives together; no accidental coupling |

---

## Workflow Summary

```
Phase 0: Design Review
    ↓
Phase 1: Context & Edge Case Analysis
    ↓
Phase 2a: Write Spec → review loop → approved
    ↓
Phase 2b: Write Implementation Plan → review loop → approved
    ↓
Phase 3: Create GitHub issues + branch hierarchy
    ↓
Phase 4 (per issue, orchestrator coordinates):
  Spawn sub-agent (scoped to issue)
    → Sub-agent implements
    → Orchestrator reviews (review loop)
    → Orchestrator creates PR
    ↓ (user merges)
```

---

## What Claude Does NOT Do

- Does **not** merge PRs — only creates them.
- Does **not** skip phases for "small" features.
- Does **not** start implementation before both documents are reviewed and approved.
- Does **not** invent design decisions not present in Figma or the spec.
- Does **not** write production code directly as orchestrator — delegates implementation to sub-agents.
- Does **not** allow sub-agents to deviate from the approved spec without orchestrator approval.
- Does **not** assume or guess when requirements, design intent, or scope are unclear — always asks the user first and waits for confirmation before continuing.