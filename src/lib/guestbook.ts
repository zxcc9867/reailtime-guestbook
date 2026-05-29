import type { GuestbookDraft, ImageType } from '../types';

export interface GuestbookDraftErrors {
  authorName?: string;
  content?: string;
}

export interface GuestbookDraftValidation {
  valid: boolean;
  errors: GuestbookDraftErrors;
}

export function validateGuestbookDraft(
  draft: GuestbookDraft
): GuestbookDraftValidation {
  const errors: GuestbookDraftErrors = {};

  if (!draft.authorName.trim()) {
    errors.authorName = '이름 또는 닉네임을 입력해 주세요.';
  }

  if (!draft.message.trim() && !draft.hasImage) {
    errors.content = '메시지, 사진, 그림 중 하나를 남겨 주세요.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function mergeById<T extends { id: string | number }>(
  records: T[],
  incoming: T
): T[] {
  if (records.some((record) => record.id === incoming.id)) {
    return records;
  }

  return [incoming, ...records];
}

export function buildStoragePath(imageType: ImageType, fileName: string) {
  const extension =
    fileName.lastIndexOf('.') > 0 ? fileName.split('.').pop()?.toLowerCase() : '';
  const safeExtension =
    extension && /^[a-z0-9]+$/.test(extension) ? extension : 'png';
  const folder = imageType === 'photo' ? 'photos' : 'drawings';

  return `posts/${folder}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;
}
