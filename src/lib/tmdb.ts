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
}

export interface MovieResponse {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export const tmdbEndpoints = {
	trending: `${TMDB_API_BASE}/trending/movie/day`,
	popular: `${TMDB_API_BASE}/movie/popular`,
	upcoming: `${TMDB_API_BASE}/movie/upcoming`,
	nowPlaying: `${TMDB_API_BASE}/movie/now_playing`,
	topRated: `${TMDB_API_BASE}/movie/top_rated`,
	search: (query: string) =>
		`${TMDB_API_BASE}/search/movie?query=${encodeURIComponent(query)}`,
	movie: (id: number) => `${TMDB_API_BASE}/movie/${id}`,
	movieCredits: (id: number) => `${TMDB_API_BASE}/movie/${id}/credits`,
	movieVideos: (id: number) => `${TMDB_API_BASE}/movie/${id}/videos`,
	movieSimilar: (id: number) => `${TMDB_API_BASE}/movie/${id}/similar`,
};

export const getImageUrl = (
	path: string,
	size: "w500" | "original" = "w500"
) => {
	if (!path) return "/no-image.png";
	return `${TMDB_IMAGE_BASE}/${size}${path}`;
};
