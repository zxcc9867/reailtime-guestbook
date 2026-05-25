# Architecture

## Product Goal

Build a realtime digital guestbook web app. Visitors can leave a guestbook post by uploading a photo or drawing directly on a canvas. Other visitors can view posts as post-it notes on a shared wall. Clicking a post-it opens the full post and a realtime comment thread.

## Target Stack

- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS or CSS Modules
- Backend: Supabase
- Database: Supabase Postgres
- Realtime: Supabase Realtime
- Storage: Supabase Storage
- Environment config: `.env.example`

## Application Routes

### `/`

The creation page is the first screen. It should focus on writing a guestbook entry, not on marketing content.

Responsibilities:

- Let the visitor choose between photo upload and drawing mode.
- Collect author name or nickname.
- Collect a short message.
- Preview uploaded photo or current drawing.
- Validate required fields.
- Upload image data when needed.
- Create a `guestbook_posts` row.
- Navigate to `/wall` after successful submission.

### `/wall`

The wall page displays all guestbook posts as post-it cards.

Responsibilities:

- Load existing posts.
- Subscribe to realtime `guestbook_posts` insert events.
- Render post-it cards with author name, message excerpt, thumbnail, color, and rotation.
- Merge realtime inserts by `id` to avoid duplicates.
- Open the selected post in a detail modal or side panel.

### Post Detail Modal or Panel

The detail view is opened from a post-it card.

Responsibilities:

- Show full image or drawing.
- Show full message and author.
- Load comments for the selected post.
- Subscribe to realtime comment inserts for the selected `post_id`.
- Add new comments.
- Merge realtime comment inserts by `id`.
- Unsubscribe when the detail view closes or selected post changes.

## Data Model

### `guestbook_posts`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `author_name` | text | Visitor name or nickname |
| `message` | text | Guestbook message |
| `image_url` | text | Public or signed Supabase Storage URL |
| `image_type` | text | `photo` or `drawing` |
| `rotation` | numeric | Small rotation value for post-it rendering |
| `created_at` | timestamptz | Creation timestamp |

### `comments`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | uuid | Primary key |
| `post_id` | uuid | Related guestbook post |
| `author_name` | text | Comment author |
| `content` | text | Comment body |
| `created_at` | timestamptz | Creation timestamp |

## Suggested Source Structure

```text
src/
  components/
    DrawingCanvas.tsx
    PhotoUploader.tsx
    PostDetailModal.tsx
    PostItCard.tsx
  lib/
    supabase.ts
    upload.ts
  pages/
    HomePage.tsx
    WallPage.tsx
  types.ts
supabase/
  schema.sql
```

## Component Boundaries

- `DrawingCanvas`: owns canvas drawing state, pen color, pen width, eraser mode, clear action, and export-to-image behavior.
- `PhotoUploader`: owns file selection, file validation, and preview rendering.
- `HomePage`: coordinates form state, validation, upload, post creation, and navigation.
- `WallPage`: owns post loading, realtime post subscription, wall layout, and selected post state.
- `PostItCard`: renders one post preview and exposes a click target.
- `PostDetailModal`: owns selected post display, comment loading, realtime comment subscription, and comment creation.
- `supabase.ts`: creates and exports the Supabase client.
- `upload.ts`: handles photo and drawing uploads to Supabase Storage.

## Realtime Behavior

- `WallPage` subscribes to `guestbook_posts` insert events.
- `PostDetailModal` subscribes to `comments` insert events filtered by the active `post_id`.
- Realtime payloads are merged into local state by `id`.
- Subscriptions are removed when components unmount.
- Post and comment creation should optimistically show loading states, but avoid showing unconfirmed records unless duplicate handling is robust.

## Storage Behavior

- Photos are uploaded as files selected by the visitor.
- Drawings are exported from the canvas and uploaded as image blobs.
- Storage paths should include stable prefixes such as `posts/photos/` and `posts/drawings/`.
- The app should store the resulting URL in `guestbook_posts.image_url`.

## UX Principles

- The first screen should be practical and focused on creating a post.
- The wall should feel warm, bright, and suitable for an event or exhibition.
- Post-it cards may use a small set of colors and slight rotation values.
- The UI must work on mobile and desktop.
- Controls need accessible labels, visible focus states, and keyboard-friendly modal closing.

## Error Handling

- Validate before submit:
  - author name is required.
  - at least one of message, photo, or drawing is required.
- Show loading state while uploading and saving.
- Show actionable error messages when upload or database writes fail.
- Prevent duplicate submissions while a save is in progress.

## Deployment Notes

- Required Supabase values belong in `.env.example`.
- `supabase/schema.sql` should define tables, indexes, row-level security, storage bucket guidance, and realtime requirements.
- README should explain local development, Supabase setup, schema application, environment variables, and deployment.
