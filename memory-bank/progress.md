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

- Draft PR 검토 및 병합

#### 다음 우선순위

- Draft PR을 검토한 뒤 병합한다.
### 2026-08-20 - 다국어 README Draft PR 게시

#### 완료한 작업

- 문서 전용 브랜치 `agent/multilingual-readmes`를 생성하고 원격에 푸시했다.
- README 콘텐츠 커밋 `778b3fc`을 생성했다.
- Draft PR #1: https://github.com/zxcc9867/reailtime-guestbook/pull/1
- PR은 `master`을 대상으로 하며 병합 가능 상태를 확인했다.

#### 변경된 파일

- `memory-bank/active-context.md`
- `memory-bank/progress.md`

#### 검증 방법

- 원격 브랜치 추적 상태 확인
- Draft PR의 base/head, open/draft 상태 확인
- PR 병합 가능 상태 확인
- 문서 상대 링크·공백·비밀정보 패턴 검사 통과

#### 남은 작업

- Draft PR 검토 및 병합

#### 다음 우선순위

- PR의 언어별 렌더링을 최종 확인한 뒤 병합한다.

### 2026-08-20 - 다국어 README 병합 완료

#### 완료한 작업

- PR #1 을(를) master 브랜치에 squash merge했다: https://github.com/zxcc9867/reailtime-guestbook/pull/1
- 병합 커밋 SHA는 f2e3a0a93e6da12bc1fc5db276c5bb2d32d417a3 이다.

#### 변경된 파일

- memory-bank/active-context.md
- memory-bank/progress.md

#### 검증 방법

- GitHub PR 상태 MERGED 확인
- master 브랜치가 병합 커밋을 포함하는지 확인

#### 남은 작업

- 원격 agent/multilingual-readmes 브랜치 삭제는 별도 승인 시 수행

#### 다음 우선순위

- 없음
