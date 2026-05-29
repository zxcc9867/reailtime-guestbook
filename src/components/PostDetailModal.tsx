import { FormEvent, useEffect, useState } from 'react';
import { mergeById } from '../lib/guestbook';
import { supabase } from '../lib/supabase';
import type { GuestbookComment, GuestbookPost } from '../types';

interface PostDetailModalProps {
  post: GuestbookPost;
  onClose: () => void;
}

export function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const [comments, setComments] = useState<GuestbookComment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postAuthorName = post.author_name || '익명';

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setComments([]);

    async function loadComments() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error: loadError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (cancelled) {
        return;
      }

      if (loadError) {
        setError(loadError.message);
      } else {
        setComments((data ?? []) as GuestbookComment[]);
      }

      setLoading(false);
    }

    void loadComments();

    const client = supabase;

    if (!client) {
      return () => {
        cancelled = true;
      };
    }

    const channel = client
      .channel(`comments:${post.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${post.id}`
        },
        (payload) => {
          setComments((current) =>
            mergeById(current, payload.new as GuestbookComment).sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, [post.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authorName.trim() || !content.trim()) {
      setError('댓글 이름과 내용을 입력해 주세요.');
      return;
    }

    if (!supabase) {
      setError('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }

    setSaving(true);
    setError(null);

    const { error: saveError } = await supabase.from('comments').insert({
      post_id: post.id,
      author_name: authorName.trim(),
      content: content.trim()
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setContent('');
    }

    setSaving(false);
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <article
        className="post-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close-button" type="button" onClick={onClose}>
          닫기
        </button>
        <div className="modal-content-grid">
          <section className="post-full">
            {post.image_url ? (
              <img src={post.image_url} alt={`${postAuthorName}의 이미지`} />
            ) : (
              <div className="image-empty">이미지 없이 남긴 글</div>
            )}
            <h2 id="post-detail-title">{postAuthorName}의 방명록</h2>
            <p>{post.content || '사진 또는 그림으로 마음을 남겼습니다.'}</p>
          </section>
          <section className="comment-panel" aria-label="댓글">
            <h3>실시간 댓글</h3>
            {loading ? <p className="muted">댓글을 불러오는 중...</p> : null}
            {!loading && comments.length === 0 ? (
              <p className="muted">아직 댓글이 없습니다.</p>
            ) : null}
            <div className="comment-list">
              {comments.map((comment) => (
                <article className="comment" key={comment.id}>
                  <strong>{comment.author_name || '익명'}</strong>
                  <p>{comment.content}</p>
                </article>
              ))}
            </div>
            <form className="comment-form" onSubmit={handleSubmit}>
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="이름"
                aria-label="댓글 작성자 이름"
                maxLength={30}
              />
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="댓글을 남겨 주세요."
                aria-label="댓글 내용"
                maxLength={240}
              />
              {error ? <p className="form-error">{error}</p> : null}
              <button type="submit" disabled={saving}>
                {saving ? '등록 중...' : '댓글 등록'}
              </button>
            </form>
          </section>
        </div>
      </article>
    </div>
  );
}
