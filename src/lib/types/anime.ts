export interface Image {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface Images {
  jpg: Image;
  webp: Image;
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embed_url: string;
}

export interface Title {
  type: string;
  title: string;
}

export interface AiredDate {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Aired {
  from: string;
  to: string | null;
  prop: {
    from: AiredDate;
    to: AiredDate;
    string: string;
  };
}

export interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Studio[];
  licensors: Studio[];
  studios: Studio[];
  genres: Genre[];
  explicit_genres: Genre[];
  themes: Genre[];
  demographics: Genre[];
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeDetails extends Anime {
  relations: {
    relation: string;
    entry: {
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }[];
  }[];
  theme: {
    openings: string[];
    endings: string[];
  };
  external: {
    name: string;
    url: string;
  }[];
  streaming: {
    name: string;
    url: string;
  }[];
}

export interface UserAnimeList {
  id: string;
  anime: Anime;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  score: number;
  progress: number;
  rewatches: number;
  start_date?: string;
  finish_date?: string;
  created_at: string;
  updated_at: string;
}
