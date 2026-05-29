# Implementation Plan

## Phase 1: Project Scaffold

Completed.

- React + TypeScript + Vite app exists in the repository root.
- Runtime dependencies include Supabase and React Router.
- App shell includes routes for `/` and `/wall`.

## Phase 2: Supabase Foundation

Completed against the remote Supabase project.

1. Use the existing `public.guestbook` table for guestbook posts.
2. Use `public.comments` for realtime comments.
3. Run `supabase/schema.sql` to extend the existing `guestbook` table with:
   - `author_name`
   - `image_url`
   - `image_type`
   - `rotation`
4. Ensure `comments` has:
   - `post_id`
   - `author_name`
   - `content`
   - `created_at`
5. Add indexes for `guestbook.created_at` and `comments(post_id, created_at)`.
6. Add row-level security policies for MVP public read/write behavior.
7. Create public Storage bucket `guestbook-media`.
8. Enable Realtime for `guestbook` and `comments`.

Verified outputs:

- Existing Supabase tables match the app contract.
- `guestbook` and `comments` have MVP public read/write RLS policies.
- `guestbook-media` exists with anon upload/read policies under `posts/`.

## Phase 3: Shared Types and Supabase Client

Completed.

- `src/types.ts` defines guestbook post/comment types.
- `src/lib/supabase.ts` reads Vite env vars.
- `src/lib/upload.ts` uploads photo and drawing blobs to Supabase Storage.

## Phase 4: Creation Page

Completed in app code.

- `HomePage` supports photo upload and drawing mode.
- It validates author and content/image presence.
- It uploads image data when needed.
- It inserts into `guestbook` using `content` for the message body.

External setup status:

- Remote schema migration has been applied.
- `guestbook-media` bucket and policies have been created.

## Phase 5: Realtime Wall

Completed in app code.

- `WallPage` fetches from `guestbook`.
- It subscribes to `guestbook` insert events.
- It renders post-it cards and opens detail modal.
- It cleans up realtime subscriptions on unmount.

External setup status:

- Realtime publication has been enabled for `guestbook`.

## Phase 6: Realtime Comments

Completed in app code.

- `PostDetailModal` loads comments from `comments`.
- It filters comments by `post_id`.
- It subscribes to realtime `comments` insert events for the active post.
- It inserts new comments and cleans up subscriptions.

External setup status:

- `comments.post_id` exists and references `guestbook.id`.
- Realtime publication has been enabled for `comments`.

## Phase 7: Polish and Accessibility

Partially complete.

- Modal closes by button, backdrop, and Escape.
- Inputs have labels or aria labels.
- Loading and error states exist.

Open checks:

- Verify mobile layout.
- Verify canvas touch drawing.
- Verify file size/type guidance in the UI.

## Phase 8: Verification

Run after code changes:

```powershell
npm test
npm run lint
npm run build
```

Manual checks:

- Create a text-only guestbook entry.
- Create a photo post.
- Create a drawing post.
- Confirm `/wall` receives new posts without refresh.
- Open a post and confirm comments update without refresh in two tabs.
- Confirm mobile viewport behavior.
