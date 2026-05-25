# Progress

## Current Status

- Repository initialized as a Git repository.
- Remote `origin` is configured as `https://github.com/zxcc9867/reailtime-guestbook.git`.
- Product concept has been captured from the app prompt.
- Memory bank documentation has been started.

## Completed

- Defined the app goal: realtime digital guestbook with photo or drawing posts.
- Defined the target stack: React, TypeScript, Vite, Supabase, Supabase Storage, Supabase Realtime.
- Defined primary routes:
  - `/` for post creation.
  - `/wall` for realtime post-it wall.
  - post detail modal or panel for realtime comments.
- Defined initial data model:
  - `guestbook_posts`
  - `comments`
- Defined expected source structure.

## Not Started

- Vite React TypeScript project scaffold.
- Styling system decision between Tailwind CSS and CSS Modules.
- Supabase project setup.
- Supabase SQL schema.
- Supabase Storage bucket setup.
- Environment variable template.
- Frontend implementation.
- Realtime subscriptions.
- README.
- Automated tests.
- Deployment setup.

## Open Decisions

- Styling approach: Tailwind CSS or CSS Modules.
- Detail UI: modal or right-side panel.
- Authentication: anonymous public posting for MVP, or lightweight identity controls.
- Storage URL strategy: public bucket URLs or signed URLs.
- Moderation: whether posts and comments are immediately public or require review.
- Post-it layout: responsive grid with randomized style values, or freer masonry-like layout.

## Known Risks

- Public anonymous write access requires careful Supabase RLS policies.
- Realtime subscriptions can create duplicate records unless state is merged by `id`.
- Canvas export and mobile touch drawing need explicit testing.
- Large uploads can slow submission without file size limits.
- Public guestbooks may need spam prevention or moderation after MVP.

## Next Milestone

Create the initial MVP implementation:

1. Scaffold React + TypeScript + Vite.
2. Add Supabase client setup.
3. Add schema and environment examples.
4. Build creation page.
5. Build realtime wall page.
6. Build realtime post detail comments.
7. Add README and verification steps.
