import type { ImageType } from '../types';
import { buildStoragePath } from './guestbook';
import { supabase } from './supabase';

const BUCKET_NAME = 'guestbook-media';

export async function uploadGuestbookImage(
  imageType: ImageType,
  file: File | Blob,
  fileName: string
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
  }

  const path = buildStoragePath(imageType, fileName);
  const contentType =
    file instanceof File ? file.type || 'image/png' : 'image/png';

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    cacheControl: '3600',
    contentType,
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}
