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

Run tests and the production build with: `npm run check`
The `/check` adapter currently runs tests only. There is no lint command.

## Build / Run

Run locally with `npm run dev`. Open the `/themx/` base path.
Build with `npm run build`. Preview the build with `npm run preview`.

## Don'ts

- Don't commit `.env` files or any secrets.
- Don't run destructive operations (force-push, `git reset --hard`, dropping tables) without explicit user approval.
- Don't assume CI passes; run `/check` locally first.

## Project-specific notes

Theme content is in `src/data/themes/`. Keep design type, use-case metadata,
layout rules, and interaction rules in each theme's frontmatter.
Live previews use isolated iframe documents. Keep their style variables
consistent with prompt output and CSS/JSON exports.
