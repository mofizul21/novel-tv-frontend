// Shared sub-entity shapes returned by the Movie/Series API resources.

export type Genre = { id: number; name: string; slug: string };
export type Country = { id: number; name: string; code: string };
export type Language = { id: number; name: string; code: string };
export type Director = { id: number; name: string; slug: string; photo_url: string | null };
export type CastMember = {
  id: number;
  name: string;
  slug: string;
  photo_url: string | null;
  character_name?: string;
  credit_order?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ContentAccess = {
  can_watch: boolean;
  reason: "subscribed" | "ppv_purchased" | "requires_subscription" | "requires_ppv";
};

export type PlaybackTokens = {
  token: string | null;
  thumbnailToken: string | null;
  storyboardToken: string | null;
};
