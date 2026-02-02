
export interface Anime {
  id: string; // This is the slug
  title: string;
  thumbnail: string;
  banner: string;
  episode: string;
  status: 'ONGOING' | 'COMPLETED';
  year: number;
  rating: number;
  genre: string[];
  synopsis: string;
  likes?: string;
  type?: string;
}

export interface DetailedEpisode {
  title: string;
  episode: string;
  date: string;
  slug: string;
}

export interface OtakudesuGenre {
  title: string;
  genreId: string;
  href: string;
  otakudesuUrl: string;
}

export interface Genre {
  title: string;
  genreId: string;
}

export interface OtakudesuEpisode {
  title: string;
  eps: number | string;
  date: string;
  episodeId: string;
  href: string;
  otakudesuUrl: string;
}

export interface OtakudesuDetail {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  producers: string;
  type: string;
  status: string;
  episodes: number;
  duration: string;
  aired: string;
  studios: string;
  genreList: OtakudesuGenre[];
  episodeList: OtakudesuEpisode[];
  synopsis: {
    paragraphs: string[];
    connections: {
      title: string;
      animeId: string;
      href: string;
      otakudesuUrl: string;
    }[];
  };
  recommendedAnimeList?: {
    title: string;
    poster: string;
    animeId: string;
    href: string;
    otakudesuUrl: string;
  }[];
}

export interface BatchDownload {
  title: string;
  url: string;
}

export interface BatchQuality {
  title: string;
  size: string;
  urls: BatchDownload[];
}

export interface BatchFormat {
  title: string;
  qualities: BatchQuality[];
}

export interface DetailedAnime extends Anime {
  info: {
    alternatif?: string;
    tipe?: string;
    jumlah_episode?: string | number;
    studio?: string;
    musim?: string;
    score?: string;
    producers?: string;
    duration?: string;
    aired?: string;
    japanese?: string;
  };
  episodes: DetailedEpisode[];
  episodeList?: OtakudesuEpisode[];
  recommended?: any[];
  recommendedAnimeList?: any[];
  batch?: {
    title: string;
    batchId: string;
    href: string;
    otakudesuUrl: string;
  };
  batchData?: {
    title: string;
    downloadUrl: {
      formats: BatchFormat[];
    };
  };
}

export interface ScheduleAnime {
  title: string;
  slug: string;
  url: string;
  poster: string;
}

export interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnime[];
}

export interface Episode {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  year?: number;
  description?: string;
}
