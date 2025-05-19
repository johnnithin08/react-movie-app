declare interface IMovie {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: Array<number>;
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

declare interface IMovieResponse {
	page: number;
	results: Array<IMovie>;
}

declare interface Genre {
	id: number;
	name: string;
}
declare interface Creator {
	id: number;
	name: string;
	job?: string;
}
declare interface Cast {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
}
declare interface Company {
	id: number;
	name: string;
	logo_path: string | null;
}
declare interface Provider {
	provider_name: string;
	logo_path: string;
}
declare interface Recommendation {
	id: number;
	title?: string;
	name?: string;
	poster_path: string | null;
	vote_average: number;
}
