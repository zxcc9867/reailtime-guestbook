import type { ChangeEvent } from 'react';

interface PhotoUploaderProps {
  file: File | null;
  previewUrl: string | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024;

export function PhotoUploader({
  file,
  previewUrl,
  disabled,
  onFileChange
}: PhotoUploaderProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    if (!selected) {
      onFileChange(null);
      return;
    }

    if (!selected.type.startsWith('image/')) {
      event.target.value = '';
      onFileChange(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      event.target.value = '';
      onFileChange(null);
      return;
    }

    onFileChange(selected);
  }

  return (
    <section className="media-panel" aria-labelledby="photo-title">
      <div>
        <h2 id="photo-title">사진 첨부</h2>
        <p>JPG, PNG, GIF 이미지를 6MB 이하로 올릴 수 있어요.</p>
      </div>
      <label className="upload-dropzone">
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={handleChange}
          aria-label="방명록 사진 선택"
        />
        {previewUrl ? (
          <img src={previewUrl} alt="선택한 사진 미리보기" />
        ) : (
          <span>사진을 선택해 주세요</span>
        )}
      </label>
      {file ? <p className="file-name">{file.name}</p> : null}
    </section>
  );
}
