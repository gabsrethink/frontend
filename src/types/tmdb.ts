export interface Genre {
  id: number;
  name: string;
}

export interface CrewMember {
  id: number;
  job: string;
  name: string;
  department: string;
}

export interface Credits {
  cast: unknown[];
  crew: CrewMember[];
}

export interface ReleaseDateInfo {
  certification: string;
  release_date: string;
  type: number;
}

export interface ReleaseDatesResponse {
  results: {
    iso_3166_1: string; // Código BR
    release_dates: ReleaseDateInfo[];
  }[];
}

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  genres?: Genre[];
  runtime?: number;
  credits?: Credits;
  release_dates?: ReleaseDatesResponse;
}
export interface PaginatedMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FavoritesResponse {
  movieDetails: Movie[];
  shareId: string;
}

export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SharedListResponse {
  movieDetails: Movie[];
}
