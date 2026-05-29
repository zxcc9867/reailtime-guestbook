import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DrawingCanvas,
  type DrawingCanvasHandle
} from '../components/DrawingCanvas';
import { PhotoUploader } from '../components/PhotoUploader';
import { validateGuestbookDraft } from '../lib/guestbook';
import { supabase } from '../lib/supabase';
import { uploadGuestbookImage } from '../lib/upload';
import type { ImageType } from '../types';

type EntryMode = 'photo' | 'drawing';

export function HomePage() {
  const navigate = useNavigate();
  const drawingRef = useRef<DrawingCanvasHandle | null>(null);
  const [mode, setMode] = useState<EntryMode>('photo');
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [photoFile]);

  const modeLabel = useMemo(
    () => (mode === 'photo' ? '사진 첨부' : '그림 그리기'),
    [mode]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const drawingBlob =
      mode === 'drawing' ? await drawingRef.current?.exportBlob() : null;
    const selectedImage = mode === 'photo' ? photoFile : drawingBlob;
    const hasImage = Boolean(selectedImage);
    const validation = validateGuestbookDraft({
      authorName,
      message,
      hasImage
    });

    if (!validation.valid) {
      setError(Object.values(validation.errors)[0] ?? '입력값을 확인해 주세요.');
      return;
    }

    if (!supabase) {
      setError('.env에 Supabase URL과 anon key를 설정해 주세요.');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;
      let imageType: ImageType | null = null;

      if (selectedImage) {
        imageType = mode;
        imageUrl = await uploadGuestbookImage(
          mode,
          selectedImage,
          mode === 'photo' && photoFile ? photoFile.name : 'drawing.png'
        );
      }

      const { error: insertError } = await supabase.from('guestbook').insert({
        author_name: authorName.trim(),
        content: message.trim(),
        image_url: imageUrl,
        image_type: imageType,
        rotation: Math.round((Math.random() * 7 - 3.5) * 10) / 10
      });

      if (insertError) {
        throw insertError;
      }

      navigate('/wall');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : '방명록을 저장하지 못했습니다.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="home-shell">
      <section className="entry-board" aria-labelledby="home-title">
        <div className="entry-copy">
          <p className="eyebrow">Realtime Guestbook</p>
          <h1 id="home-title">
            오늘의 마음을 사진이나 그림으로 남겨 주세요
          </h1>
          <p>
            작성하면 바로 방명록 벽에 붙고, 사람들이 같은 포스트잇에서
            실시간으로 댓글을 주고받을 수 있습니다.
          </p>
          <Link className="wall-link" to="/wall">
            방명록 벽 보기
          </Link>
        </div>

        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="segmented-control" role="tablist" aria-label="등록 방식">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'photo'}
              className={mode === 'photo' ? 'active' : ''}
              onClick={() => setMode('photo')}
            >
              사진
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'drawing'}
              className={mode === 'drawing' ? 'active' : ''}
              onClick={() => setMode('drawing')}
            >
              그림
            </button>
          </div>

          <div className="field-grid">
            <label>
              이름 또는 닉네임
              <input
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                maxLength={30}
                placeholder="예: 지니"
                autoComplete="name"
              />
            </label>
            <label>
              짧은 메시지
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={180}
                placeholder="오늘 기억하고 싶은 말을 적어 주세요."
              />
            </label>
          </div>

          {mode === 'photo' ? (
            <PhotoUploader
              file={photoFile}
              previewUrl={photoPreviewUrl}
              disabled={submitting}
              onFileChange={setPhotoFile}
            />
          ) : (
            <DrawingCanvas ref={drawingRef} />
          )}

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <button className="primary-action" type="submit" disabled={submitting}>
            {submitting ? `${modeLabel} 저장 중...` : '방명록 등록'}
          </button>
        </form>
      </section>
    </main>
  );
}
