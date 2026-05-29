import type { CSSProperties } from 'react';
import type { GuestbookPost } from '../types';

interface PostItCardProps {
  post: GuestbookPost;
  index: number;
  onSelect: (post: GuestbookPost) => void;
}

const COLORS = ['#fff1a8', '#fdd7b0', '#cbe9c5', '#bfe2ff', '#ffd2dd'];

export function PostItCard({ post, index, onSelect }: PostItCardProps) {
  const color = COLORS[index % COLORS.length];
  const rotation = post.rotation || ((index % 5) - 2) * 1.7;
  const authorName = post.author_name || '익명';

  return (
    <button
      className="post-it"
      type="button"
      onClick={() => onSelect(post)}
      style={
        {
          '--post-color': color,
          '--post-rotation': `${rotation}deg`
        } as CSSProperties
      }
      aria-label={`${authorName}님의 방명록 열기`}
    >
      <span className="tape" aria-hidden="true" />
      {post.image_url ? (
        <img src={post.image_url} alt="" className="post-thumb" />
      ) : (
        <span className="post-thumb placeholder">글</span>
      )}
      <strong>{authorName}</strong>
      <p>{post.content || '사진으로 남긴 방명록입니다.'}</p>
      <time dateTime={post.created_at}>
        {new Intl.DateTimeFormat('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(post.created_at))}
      </time>
    </button>
  );
}
