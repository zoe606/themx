# themx — Agent Conventions

This file is the **canonical source of project rules** for AI agents (Claude Code, Cursor, Aider, Windsurf, Antigravity, etc.). Tool-specific files in this repo (`CLAUDE.md`, `.cursorrules`, `.cursor/rules/*.mdc`, `.windsurf/rules/*.md`) are auto-generated adapters that point here.

## Overview

- **Stack**: Node/TypeScript
- **Primary language**: TypeScript/JavaScript
- **Test runner**: npm test

## Conventions

- Match existing code style; do not introduce a new framework or pattern without explicit approval.
- Prefer editing existing files over creating new ones.
- Write no comments unless the *why* is non-obvious.

## Testing

Run tests with: `npm test`

Run full check (lint + tests) with the slash command: `/check`

## Build / Run

_(Add project-specific build/run notes here.)_

## Don'ts

- Don't commit `.env` files or any secrets.
- Don't run destructive operations (force-push, `git reset --hard`, dropping tables) without explicit user approval.
- Don't assume CI passes; run `/check` locally first.

## Project-specific notes

_(Add anything else an agent should know about this project.)_
