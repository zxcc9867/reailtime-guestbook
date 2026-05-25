# Repository Guidelines

## Project Overview

This repository is for a realtime digital guestbook web app. Visitors can upload a photo or draw on a canvas to create a guestbook post. Posts appear as post-it notes on a realtime wall, and each post has a realtime comment thread.

## Memory Bank Requirement

Agents must always consult and maintain the memory bank documents in `memory-bank/`.

Before making project changes:

- Read `memory-bank/architecture.md` to understand the intended architecture and boundaries.
- Read `memory-bank/implementation-plan.md` to understand the current execution plan.
- Read `memory-bank/progress.md` to understand completed work, open decisions, and current risks.

After making project changes:

- Update `memory-bank/progress.md` with completed work, new risks, and remaining gaps.
- Update `memory-bank/architecture.md` when architecture, data flow, routes, components, or storage/realtime behavior changes.
- Update `memory-bank/implementation-plan.md` when the implementation sequence, scope, or verification steps change.

Do not treat the memory bank as optional. Keep it accurate enough that a new agent can continue the project without relying on chat history.

## Project Structure

Expected application structure:

```text
src/
  components/
  lib/
  pages/
  types.ts
supabase/
  schema.sql
memory-bank/
  architecture.md
  implementation-plan.md
  progress.md
```

## Build, Test, and Development Commands

The project has not been scaffolded yet. Once the React app is created, document the actual commands here and in `README.md`.

Expected commands after scaffolding:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

## Coding Style

- Use React with TypeScript.
- Keep components focused and reusable.
- Keep Supabase client and upload logic under `src/lib/`.
- Keep route-level orchestration in `src/pages/`.
- Prefer explicit types for Supabase records and UI state.
- Avoid unrelated refactors.

## UX Requirements

- Build the usable app as the first screen; do not create a marketing landing page.
- Support photo upload and drawing creation on the home page.
- Render the wall as post-it-style cards.
- Show realtime post and comment updates without page refresh.
- Support mobile and desktop layouts.
- Include accessible labels, keyboard focus states, and modal close behavior.

## Data and Safety

- Do not modify or delete user-generated guestbook data outside explicit app behavior.
- Be careful with public anonymous writes in Supabase policies.
- Merge realtime records by `id` to avoid duplicates.
- Unsubscribe from realtime channels when components unmount.

## Documentation

Keep `README.md`, `.env.example`, `supabase/schema.sql`, and `memory-bank/` aligned as the project evolves.
