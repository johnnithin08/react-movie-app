export const TMDB_API_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface Movie {
	id: number;
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	media_type: "movie";
}

export interface MovieResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export interface TV {
	id: number;
	backdrop_path: string;
	genre_ids: number[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	first_air_date: string;
	name: string;
	vote_average: number;
	vote_count: number;
	origin_country: string[];
	media_type: "tv";
}

export interface TVResponse {
	page: number;
	results: TV[];
	total_pages: number;
	total_results: number;
}

export interface MultiSearchResponse {
	page: number;
	results: (Movie | TV)[];
	total_pages: number;
	total_results: number;
}

export const tmdbEndpoints = {
	trending: `${TMDB_API_BASE}/trending/all/day`,
	popularMovies: `${TMDB_API_BASE}/movie/popular`,
	popularTV: `${TMDB_API_BASE}/tv/popular`,
	upcoming: `${TMDB_API_BASE}/movie/upcoming`,
	nowPlaying: `${TMDB_API_BASE}/movie/now_playing`,
	topRatedMovies: `${TMDB_API_BASE}/movie/top_rated`,
	topRatedTV: `${TMDB_API_BASE}/tv/top_rated`,
	search: (query: string) =>
		`${TMDB_API_BASE}/search/multi?query=${encodeURIComponent(query)}`,
	movie: (id: number) => `${TMDB_API_BASE}/movie/${id}`,
	tv: (id: number) => `${TMDB_API_BASE}/tv/${id}`,
	movieCredits: (id: number) => `${TMDB_API_BASE}/movie/${id}/credits`,
	tvCredits: (id: number) => `${TMDB_API_BASE}/tv/${id}/credits`,
	movieVideos: (id: number) => `${TMDB_API_BASE}/movie/${id}/videos`,
	tvVideos: (id: number) => `${TMDB_API_BASE}/tv/${id}/videos`,
	movieSimilar: (id: number) => `${TMDB_API_BASE}/movie/${id}/similar`,
	tvSimilar: (id: number) => `${TMDB_API_BASE}/tv/${id}/similar`,
};

export const getImageUrl = (
	path: string,
	size: "w500" | "original" = "w500"
) => {
	if (!path) return "/no-image.png";
	return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
