# Progress

## Current Status

- React + TypeScript + Vite application exists in the repository.
- App has creation and wall routes.
- Supabase environment variables are configured in `.env.local`.
- `VITE_SUPABASE_URL` was corrected to use the project root URL, not `/rest/v1`.
- App code now uses the existing Supabase `guestbook` table instead of `guestbook_posts`.
- Remote Supabase schema now matches the app contract for guestbook posts, comments, storage, RLS, and realtime publication.

## Completed

- Updated post creation to insert into `guestbook`.
- Updated wall loading and realtime subscription to read from `guestbook`.
- Updated guestbook message field mapping from `message` to existing table column `content`.
- Kept comments on the `comments` table with `post_id` linking to `guestbook.id`.
- Restored broken Korean JSX strings in the main UI components so the app can compile.
- Updated `supabase/schema.sql` to extend an existing `guestbook` table.
- Updated README and memory-bank docs to reflect the `guestbook` table.
- Verified `npm test`, `npm run lint`, and `npm run build` pass after the table-name change.
- Confirmed the local dev server on port 5000 returns HTTP 200.
- Applied remote Supabase migration `fix_guestbook_schema_for_realtime_app`.
- Applied remote Supabase migration `enable_realtime_for_guestbook_tables`.
- Rewrote `supabase/schema.sql` to match the migration applied remotely, including `guestbook-media` bucket setup.
- Verified remote REST read for `guestbook` app columns now returns HTTP 200 instead of 400.
- Verified `npm test`, `npm run lint`, and `npm run build` pass after the remote schema fix and local docs/schema updates.
- Added log file ignore rules so local Vite runtime logs are not committed.
- Rewrote README with project overview, purpose, features, stack, setup, Supabase configuration, verification, and Vercel deployment guidance.
- Added `docs/thumbnail.svg` as the README project thumbnail.
- Verified `npm test`, `npm run lint`, and `npm run build` pass after the README and thumbnail update.
- Added `.vite/` to `.gitignore` so local Vite cache output is not tracked.
- Captured actual local app screenshots for the home page and realtime wall using Edge headless.
- Added the app screenshots to README under `docs/screenshots/home.png` and `docs/screenshots/wall.png`.

## Observed Remote Supabase State

- `public.guestbook` exists with RLS enabled.
- Current `guestbook` row shape observed through Supabase MCP:
  - `id`
  - `created_at`
  - `content`
  - `author_name`
  - `image_url`
  - `image_type`
  - `rotation`
- `public.comments` exists with RLS enabled.
- `comments` now has:
  - `id`
  - `created_at`
  - `post_id`
  - `author_name`
  - `content`
- `comments.post_id` references `guestbook.id`.

## Remaining Setup

- Browser automation verification was attempted previously but blocked by a Windows sandbox startup error; do manual browser testing for the full submit/wall/comment flow.
- Run normal local verification after code changes.

## Known Risks

- Public anonymous write access requires careful RLS policies.
- Realtime subscriptions can create duplicate records unless state is merged by `id`; app code already merges by `id`.
- Canvas export and mobile touch drawing still need browser testing.
- Large uploads can slow submission without server-side limits.
- Supabase security advisors still flag unrelated `public.Book` and `public.Review` tables with RLS disabled.
- Supabase security advisors still flag an existing `guestbook` Storage bucket with a broad SELECT policy; the app uses `guestbook-media`.

## Next Milestone

1. Test text, photo, drawing, wall realtime, and comment realtime flows in the browser.
2. Connect the GitHub repository to Vercel and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Decide whether to lock down or remove unrelated legacy `Book`, `Review`, and `guestbook` bucket exposure.

### 2026-08-19 - 다국어 README 완료

#### 완료한 작업

- `README.md`를 영어 기본 문서로 정리했다.
- 기존 한국어 설명을 `README.ko.md`로 보존했다.
- `README.ja.md`를 추가했다.
- 세 문서 상단에 `English | 한국어 | 日本語` 전환 링크를 추가했다.
- 실제 저장소의 기능, 기술 스택, 실행 방법, 환경 변수, 보안·제약 사항을 대조했다.

#### 변경된 파일

- `README.md`
- `README.ko.md`
- `README.ja.md`
- `memory-bank/prd-multilingual-readme.md`
- `memory-bank/active-context.md`
- `memory-bank/implementation-plan.md`
- `memory-bank/progress.md`

#### 검증 방법

- 세 README 파일과 상단 언어 전환 링크 존재 확인
- 기술 핵심 용어 및 저장소 내부 상대 링크 해석 확인
- `git diff --check` 통과
- 애플리케이션 소스 변경이 없음을 `git status`로 확인

#### 남은 작업

- 사용자 명시적 승인 후 문서 관련 변경만 커밋·푸시

#### 다음 우선순위

- 게시 승인 시 문서 전용 브랜치와 커밋 범위를 다시 확인한다.