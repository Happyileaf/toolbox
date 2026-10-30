# AGENTS.md

Instructions for AI agents working in this repository.

## Before Making Changes

1. Read this file and the repository README.
2. Inspect the relevant category and tool directories before creating or changing a tool.
3. Check whether an existing tool already solves the same or a closely related problem.
4. Keep changes scoped to the requested tool unless the task explicitly requires repository-wide changes.

## Repository Structure

- All tool source code belongs under `src/`.
- Organize tools as `src/<category>/<tool>/`.
- Category directories are created on demand; do not create speculative categories.
- Use `kebab-case` for category and tool directory names.
- Keep repository-level documentation and configuration at the repository root.
- Do not add sample tools or empty category structures unless requested.

## Tool Independence

Every tool must be independently developable, executable, copyable, and migratable.

- Keep each tool's implementation, internal modules, dependencies, and required configuration inside its own directory.
- Do not import source code from another tool directory.
- Do not introduce repository-root runtime modules, shared runtime layers, registries, or cross-tool utility packages.
- Prefer reasonable local duplication over cross-tool source dependencies.
- A tool may split its own implementation into modules as its complexity requires.

## Implementation

1. Prefer TypeScript with Node.js by default.
2. Choose Python, Rust, Shell, or PowerShell when they provide a clear practical advantage.
3. Do not force a single language or execution model across tools.
4. Choose the simplest structure that fits the tool's actual complexity.
5. Use standard-library functionality when it is sufficient.
6. Keep third-party dependencies minimal and declare them within the tool directory.
7. Follow the existing tool's language, conventions, and style when modifying it.
8. Do not introduce frameworks, build systems, or abstractions without a concrete need.

## Entrypoints and Commands

- Give each tool a clear execution entrypoint and document how to use it.
- A tool may expose multiple related commands.
- Keep command dispatch in the entrypoint and command-specific logic in separate modules when that improves clarity.
- Simple tools do not need a command framework or dispatcher.
- Do not combine unrelated functionality into one tool.

## Safety

For destructive or potentially disruptive operations, including file deletion, bulk modification, system changes, and Git operations:

- Provide a preview or `--dry-run` mode where practical.
- Clearly identify the scope and expected effects.
- Require confirmation when appropriate.
- Avoid irreversible actions without explicit authorization.
- Consider backup or recovery options when modifying important data.

## Documentation

Document each independently useful tool in its own `README.md`. Include, as applicable:

- Purpose and capabilities.
- Environment requirements.
- Dependency installation.
- Execution instructions.
- Parameters and options.
- Usage examples.
- Limitations and safety notes.

A trivial single-file tool may use clear inline comments instead.

## Git Workflow

- Use the main branch when no branch is explicitly specified.
- Do not rewrite history or force-push unless explicitly requested.
- Keep commits focused and use descriptive commit messages.
- Do not commit generated files, secrets, credentials, or local environment files.

## Change Discipline

- Avoid unrelated refactoring and formatting changes.
- Do not add speculative infrastructure for possible future requirements.
- Do not add shared modules merely to eliminate small amounts of duplication.
- Preserve the repository's self-contained-tool philosophy in every design decision.
