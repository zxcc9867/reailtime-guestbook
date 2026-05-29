import { describe, expect, it } from 'vitest';
import {
  buildStoragePath,
  mergeById,
  validateGuestbookDraft
} from './guestbook';
import type { GuestbookPost } from '../types';

describe('validateGuestbookDraft', () => {
  it('requires an author name', () => {
    const result = validateGuestbookDraft({
      authorName: '   ',
      message: '반가워요',
      hasImage: false
    });

    expect(result.valid).toBe(false);
    expect(result.errors.authorName).toBe(
      '이름 또는 닉네임을 입력해 주세요.'
    );
  });

  it('requires a message or image', () => {
    const result = validateGuestbookDraft({
      authorName: 'Jini',
      message: '   ',
      hasImage: false
    });

    expect(result.valid).toBe(false);
    expect(result.errors.content).toBe(
      '메시지, 사진, 그림 중 하나를 남겨 주세요.'
    );
  });

  it('accepts an author with only an image', () => {
    const result = validateGuestbookDraft({
      authorName: 'Jini',
      message: '',
      hasImage: true
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('mergeById', () => {
  it('prepends new realtime records and ignores duplicates', () => {
    const existing: GuestbookPost[] = [
      {
        id: 1,
        author_name: 'A',
        content: 'old',
        image_url: null,
        image_type: null,
        rotation: 1,
        created_at: '2026-05-01T00:00:00.000Z'
      }
    ];
    const incoming: GuestbookPost = {
      id: 2,
      author_name: 'B',
      content: 'new',
      image_url: null,
      image_type: null,
      rotation: -2,
      created_at: '2026-05-02T00:00:00.000Z'
    };

    expect(mergeById(existing, incoming).map((post) => post.id)).toEqual([
      2,
      1
    ]);
    expect(mergeById(existing, existing[0]).map((post) => post.id)).toEqual([
      1
    ]);
  });
});

describe('buildStoragePath', () => {
  it('creates a safe path for photos and drawings', () => {
    expect(buildStoragePath('photo', 'summer party.png')).toMatch(
      /^posts\/photos\/\d+-[a-f0-9-]+\.png$/
    );
    expect(buildStoragePath('drawing', 'canvas')).toMatch(
      /^posts\/drawings\/\d+-[a-f0-9-]+\.png$/
    );
  });
});
