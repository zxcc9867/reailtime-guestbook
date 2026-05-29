import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostDetailModal } from '../components/PostDetailModal';
import { PostItCard } from '../components/PostItCard';
import { mergeById } from '../lib/guestbook';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { GuestbookPost } from '../types';

export function WallPage() {
  const [posts, setPosts] = useState<GuestbookPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<GuestbookPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function loadPosts() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (cancelled) {
        return;
      }

      if (loadError) {
        setError(loadError.message);
      } else {
        setPosts((data ?? []) as GuestbookPost[]);
      }

      setLoading(false);
    }

    void loadPosts();

    const client = supabase;

    if (!client) {
      return () => {
        cancelled = true;
      };
    }

    const channel = client
      .channel('guestbook')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guestbook'
        },
        (payload) => {
          setPosts((current) =>
            mergeById(current, payload.new as GuestbookPost)
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, []);

  return (
    <main className="wall-shell">
      <header className="wall-header">
        <div>
          <p className="eyebrow">Live Wall</p>
          <h1>실시간 방명록 벽</h1>
          <p>
            새 방명록과 댓글은 새로고침 없이 이 화면에 바로 나타납니다.
          </p>
        </div>
        <Link className="primary-action compact" to="/">
          새 방명록 남기기
        </Link>
      </header>

      {!isSupabaseConfigured ? (
        <section className="setup-notice">
          <h2>Supabase 설정이 필요합니다</h2>
          <p>
            `.env`에 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를
            설정하면 실시간 방명록을 사용할 수 있습니다.
          </p>
        </section>
      ) : null}

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="muted">방명록을 불러오는 중...</p> : null}

      {!loading && posts.length === 0 ? (
        <section className="empty-wall">
          <h2>아직 붙은 포스트잇이 없습니다.</h2>
          <p>첫 번째 사진이나 그림을 남겨 방명록 벽을 시작해 보세요.</p>
        </section>
      ) : null}

      <section className="post-wall" aria-label="방명록 포스트잇 목록">
        {posts.map((post, index) => (
          <PostItCard
            key={post.id}
            post={post}
            index={index}
            onSelect={setSelectedPost}
          />
        ))}
      </section>

      {selectedPost ? (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      ) : null}
    </main>
  );
}
