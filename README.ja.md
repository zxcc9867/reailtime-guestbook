# リアルタイム・ゲストブック

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

![Realtime Guestbook thumbnail](docs/thumbnail.svg)

写真のアップロードまたはキャンバスへの手描きでメッセージを作成し、共有ウォール上の付箋とコメントをリアルタイムで確認できるデジタルゲストブックです。

## プロジェクトの目的

イベント、展示、交流会、クラスなど、多くの参加者がスマートフォンから短いビジュアルメッセージを残す場面を想定しています。作成、メディア保存、共有ウォール、詳細表示、リアルタイム会話を一つのレスポンシブ MVP にまとめました。

## 画面

### メッセージ作成

![ゲストブック作成画面](docs/screenshots/home.png)

### リアルタイム共有ウォール

![リアルタイム・ゲストブック画面](docs/screenshots/wall.png)

## 主な機能

- 写真アップロードまたはブラウザ内キャンバスへの描画
- 名前・ニックネームと短いメッセージ入力
- Supabase Storage への画像保存
- Supabase Postgres への投稿保存
- `/wall` 上の付箋スタイル表示
- 新規投稿のリアルタイム反映
- 詳細モーダルとリアルタイムコメント
- モバイル・デスクトップ対応
- 入力検証、ローディング、エラー表示、Escape キーでのモーダル終了

## 技術スタック

- React 19
- TypeScript
- Vite 7
- React Router 7
- Supabase Postgres, Storage, Realtime
- Vitest, Testing Library
- ESLint

## アーキテクチャ

```text
作成ページ (/)
  ├─ 写真アップロード / キャンバス出力
  ├─ Supabase Storage: guestbook-media/posts/*
  └─ Supabase Postgres: guestbook
            │
            └─ Realtime INSERT
                         │
共有ウォール (/wall) ── 詳細表示 ── comments + Realtime
```

受信した行は `id` でマージして重複を防ぎ、対象コンポーネントの終了時に購読を解除します。

## 構成

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
supabase/
  schema.sql
docs/
  thumbnail.svg
  screenshots/
```

## ローカル実行

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

`.env.local` に Supabase の値を設定します。

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

`VITE_SUPABASE_URL` には `/rest/v1` を付けず、プロジェクトのルート URL を指定します。

## Supabase の設定

Supabase SQL Editor で [supabase/schema.sql](supabase/schema.sql) を実行します。このスキーマは次を行います。

- 既存の `public.guestbook` テーブルを拡張
- `public.comments` を作成または整合
- 作成日時とコメント検索用インデックスを追加
- MVP 用 read/insert RLS ポリシーを有効化
- public な `guestbook-media` バケットを作成
- `posts/` 以下の匿名 upload/read を許可
- `guestbook` と `comments` の Realtime を有効化

| リソース | 用途 |
| --- | --- |
| `guestbook` | ゲストブック投稿 |
| `comments` | `post_id` で紐づくコメント |
| `guestbook-media` | 写真とキャンバス画像 |

## 検証

```powershell
npm test
npm run lint
npm run build
```

テキストのみ、写真、描画の投稿、2 タブ間のリアルタイム更新、コメント、キーボード操作、モバイルのタッチ描画を手動確認します。

## デプロイ

Vercel では Vite プロジェクトとして import し、`VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定します。ビルドは `npm run build`、出力先は `dist` です。

## セキュリティと現在の制約

MVP は匿名の公開書き込みを許可しています。公開イベントや本番サービスで利用する前に、必要に応じた認証、レート制限、モデレーション、スパム対策、アップロード制限、より厳密な Storage ポリシー、監視を追加してください。anon key はブラウザ利用を前提としますが、安全性は RLS と Storage ポリシーに依存します。service-role key は公開しないでください。
