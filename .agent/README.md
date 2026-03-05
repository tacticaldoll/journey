# Journey Agent 🧠

This is the central intelligence and governance directory for the **Journey** theme project. It follows the **Antigravity Native Protocol** for Agent-Native Software Development Design (SDD).

## 🏛️ Directory Structure
- `skills/`: Cognitive boundaries, architecture standards, and "Ground Truth" rules.
- `workflows/`: Standard Operating Procedures (SOPs) and executable task paths.
- `scripts/`: Implementation scripts used by workflows to enforce architecture health.

## ⚖️ Governance Mandate
Any AI agent interacting with this repository MUST:
1.  Read `.agent/skills/journey-architecture-standards/SKILL.md` before any code modification.
2.  Use `.agent/workflows/` to execute standard tasks (e.g., vendor sync, audits).
3.  Ensure all text output adheres to the **Linux-First (LF)** line ending policy defined in this project.

## 🛡️ Protection Boundary
This directory is isolated from the main theme logic. It exists solely to provide instructions and automation for the agent. Humans SHOULD NOT manually edit files in `scripts/` or `workflows/` without updating the corresponding `implementation_plan.md`.
