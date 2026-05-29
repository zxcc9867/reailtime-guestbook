# Architecture

## Product Goal

Build a realtime digital guestbook web app. Visitors can leave a guestbook post by uploading a photo or drawing directly on a canvas. Other visitors can view posts as post-it notes on a shared wall. Clicking a post-it opens the full post and a realtime comment thread.

## Target Stack

- Frontend: React, TypeScript, Vite
- Styling: CSS in `src/App.css`
- Backend: Supabase
- Database: Supabase Postgres
- Realtime: Supabase Realtime
- Storage: Supabase Storage
- Environment config: `.env.local` from `.env.example`

## Application Routes

### `/`

The creation page is the first screen. It focuses on writing a guestbook entry, not marketing content.

Responsibilities:

- Let the visitor choose between photo upload and drawing mode.
- Collect author name or nickname.
- Collect a short message.
- Preview uploaded photo or current drawing.
- Validate required fields.
- Upload image data when needed.
- Create a `guestbook` row.
- Navigate to `/wall` after successful submission.

### `/wall`

The wall page displays all guestbook posts as post-it cards.

Responsibilities:

- Load existing posts from `guestbook`.
- Subscribe to realtime `guestbook` insert events.
- Render post-it cards with author name, content excerpt, thumbnail, color, and rotation.
- Merge realtime inserts by `id` to avoid duplicates.
- Open the selected post in a detail modal.

### Post Detail Modal

The detail view is opened from a post-it card.

Responsibilities:

- Show full image or drawing.
- Show full content and author.
- Load comments for the selected post.
- Subscribe to realtime comment inserts for the selected `post_id`.
- Add new comments.
- Merge realtime comment inserts by `id`.
- Unsubscribe when the detail view closes or selected post changes.

## Data Model

### `guestbook`

The app uses the existing Supabase table named `guestbook`.

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | bigint or compatible primary key | Primary key |
| `author_name` | text | Visitor name or nickname |
| `content` | text | Guestbook message |
| `image_url` | text | Public Supabase Storage URL |
| `image_type` | text | `photo` or `drawing` |
| `rotation` | numeric | Small rotation value for post-it rendering |
| `created_at` | timestamptz | Creation timestamp |

### `comments`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | bigint or compatible primary key | Primary key |
| `post_id` | bigint | Related `guestbook.id` |
| `author_name` | text | Comment author |
| `content` | text | Comment body |
| `created_at` | timestamptz | Creation timestamp |

## Source Structure

```text
src/
  components/
    DrawingCanvas.tsx
    PhotoUploader.tsx
    PostDetailModal.tsx
    PostItCard.tsx
  lib/
    guestbook.ts
    supabase.ts
    upload.ts
  pages/
    HomePage.tsx
    WallPage.tsx
  types.ts
supabase/
  schema.sql
```

## Realtime Behavior

- `WallPage` subscribes to `guestbook` insert events.
- `PostDetailModal` subscribes to `comments` insert events filtered by the active `post_id`.
- Realtime payloads are merged into local state by `id`.
- Subscriptions are removed when components unmount.

## Storage Behavior

- Photos are uploaded as files selected by the visitor.
- Drawings are exported from the canvas and uploaded as image blobs.
- The Supabase Storage bucket is `guestbook-media`.
- Storage paths use stable prefixes such as `posts/photos/` and `posts/drawings/`.
- Anonymous users may upload and read objects in `guestbook-media` only under the `posts/` prefix.
- The app stores the resulting URL in `guestbook.image_url`.

## Error Handling

- Validate before submit:
  - author name is required.
  - at least one of message, photo, or drawing is required.
- Show loading state while uploading and saving.
- Show actionable error messages when upload or database writes fail.
- Prevent duplicate submissions while a save is in progress.

## Deployment Notes

- Required Supabase values belong in `.env.local`.
- `supabase/schema.sql` is written as a migration for the existing `guestbook` table and comments table.
- `supabase/schema.sql` also enables Supabase Realtime for `guestbook` and `comments`.
- `supabase/schema.sql` creates the public `guestbook-media` bucket and anon upload/read policies for photo and drawing posts.
