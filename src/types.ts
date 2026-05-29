export type ImageType = 'photo' | 'drawing';
export type GuestbookPostId = string | number;

export interface GuestbookPost {
  id: GuestbookPostId;
  author_name: string | null;
  content: string;
  image_url: string | null;
  image_type: ImageType | null;
  rotation: number;
  created_at: string;
}

export interface GuestbookComment {
  id: GuestbookPostId;
  post_id: GuestbookPostId;
  author_name: string | null;
  content: string;
  created_at: string;
}

export interface GuestbookDraft {
  authorName: string;
  message: string;
  hasImage: boolean;
}
