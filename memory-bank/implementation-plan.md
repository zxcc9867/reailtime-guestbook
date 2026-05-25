# Implementation Plan

## Phase 1: Project Scaffold

1. Create a React + TypeScript + Vite app in the repository root.
2. Install runtime dependencies:
   - `@supabase/supabase-js`
   - routing library if needed, such as `react-router-dom`
3. Choose and configure the styling approach.
4. Create the planned folder structure under `src/`.
5. Add `.env.example` with Supabase environment variables.

Expected outputs:

- Working Vite dev server.
- App shell with routes for `/` and `/wall`.
- Initial README setup instructions.

## Phase 2: Supabase Foundation

1. Create `supabase/schema.sql`.
2. Define `guestbook_posts`.
3. Define `comments`.
4. Add indexes for `created_at` and `post_id`.
5. Add foreign key from `comments.post_id` to `guestbook_posts.id`.
6. Add row-level security policies for MVP public read/write behavior.
7. Document required Storage bucket setup.
8. Enable realtime requirements in the schema notes.

Expected outputs:

- Reproducible Supabase schema.
- Clear setup instructions for database, realtime, and storage.

## Phase 3: Shared Types and Supabase Client

1. Create `src/types.ts`.
2. Define `GuestbookPost`, `Comment`, and image type unions.
3. Create `src/lib/supabase.ts`.
4. Read Supabase URL and anon key from Vite environment variables.
5. Create `src/lib/upload.ts`.
6. Implement photo upload and drawing blob upload helpers.

Expected outputs:

- Centralized Supabase client.
- Typed app data structures.
- Reusable upload helpers.

## Phase 4: Creation Page

1. Build `HomePage`.
2. Add mode selection for photo upload or drawing.
3. Build `PhotoUploader`.
4. Build `DrawingCanvas`.
5. Add fields for author name and message.
6. Implement validation:
   - author name required.
   - message or image/drawing required.
7. Implement submit flow:
   - export or collect image.
   - upload image if present.
   - insert `guestbook_posts` row.
   - navigate to `/wall`.
8. Add loading and error states.

Expected outputs:

- A visitor can create a guestbook post using a photo or drawing.
- Failed submissions show clear errors.

## Phase 5: Realtime Wall

1. Build `WallPage`.
2. Fetch existing posts ordered by `created_at`.
3. Subscribe to `guestbook_posts` insert events.
4. Merge realtime posts by `id`.
5. Build `PostItCard`.
6. Render post-it colors and rotations.
7. Open detail UI when a post-it is clicked.
8. Clean up realtime subscriptions on unmount.

Expected outputs:

- The wall loads existing posts.
- New posts appear without refresh.
- Post-it cards are clickable.

## Phase 6: Realtime Comments

1. Build `PostDetailModal`.
2. Load comments for the selected post.
3. Subscribe to `comments` insert events filtered by `post_id`.
4. Merge realtime comments by `id`.
5. Add comment form.
6. Insert new comments.
7. Add loading, empty, and error states.
8. Close modal via button, Escape key, and backdrop click where appropriate.
9. Clean up subscriptions when closed or when selected post changes.

Expected outputs:

- Comments update live for users viewing the same post.
- Detail UI is accessible and responsive.

## Phase 7: Polish and Accessibility

1. Verify mobile layout.
2. Verify desktop layout.
3. Add accessible labels for icon and tool buttons.
4. Add visible keyboard focus states.
5. Ensure text does not overflow compact post-it cards.
6. Add file size and file type guidance for uploads.
7. Prevent duplicate submit clicks.

Expected outputs:

- MVP feels complete on phone and desktop.
- Basic accessibility requirements are satisfied.

## Phase 8: Verification

1. Run formatter.
2. Run linter.
3. Run type check.
4. Run production build.
5. Manually test:
   - photo post creation.
   - drawing post creation.
   - realtime wall update in two browser tabs.
   - realtime comments in two browser tabs.
   - mobile viewport.
6. Update `memory-bank/progress.md` with completed work and remaining gaps.

Expected outputs:

- Verified MVP.
- Progress document reflects reality.

## Suggested Commands

These commands should be updated after the project is scaffolded:

```powershell
npm install
npm run dev
npm run lint
npm run build
```
