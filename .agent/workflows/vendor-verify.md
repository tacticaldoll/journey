---
description: Verify local vendor dependencies against remote sources for CI/CD pipelines
---

This workflow MANDATORILY implements an assertion step to verify that all local vendor files match their upstream CDN sources exactly. This is a non-negotiable requirement for CI/CD pipelines.

**CRITICAL CI/CD NOTE**: This skill (`vendor-verify`) is an ASSERTION and is safe to run anywhere. It does not overwrite files.

If the user runs `/slash-command vendor-verify`, follow these steps precisely:

## 0. Pre-computation Cognitive Boundary
**CRITICAL**: Before executing this workflow, you MUST read the central architecture standard:
`view_file` -> `.agent/skills/journey-architecture-standards/SKILL.md`

## 1. Create the Verification Script and Git Protections
1. Create a Python script named `.agent/scripts/verify-vendor.py`.
2. This script MUST:
   - Read the expected dependency list directly from `data/vendor.json` via `.agent/scripts/vendor_utils.py`. (Do not hardcode URLs).
   - Re-fetch the remote content from the CDNs into memory via `urllib.request`.
   - Strip out carriage returns (`\r`) to normalize line endings before comparison (`text.replace('\r', '')`).
   - Compare the remote text against the local text.
   - Output `[ OK ]` or `[FAIL]` and exit with code `1` (`sys.exit(1)`) if any file fails the integrity check.
3. Auto-run the script. (`python .agent/scripts/verify-vendor.py`) (// turbo)
4. Create or append to a `.gitattributes` file to lock line endings and prevent false-positives across OS environments:
   ```text
   static/vendor/** -text
   ```

## 2. CI/CD Integration
1. If requested by the user, integrate `python .agent/scripts/verify-vendor.py` into the project's CI/CD configurations (e.g., GitHub Actions, GitLab CI).
2. Notify the user of successful verification and pipeline integrity.
