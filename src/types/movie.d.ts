declare interface DiscoverItem {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title?: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date?: string;
	title?: string;
	video?: boolean;
	vote_average: number;
	vote_count: number;
	// TV-specific/optional fields
	origin_country?: string[];
	original_name?: string;
	first_air_date?: string;
	name?: string;
}

declare interface DiscoverResponse {
	page: number;
	results: DiscoverItem[];
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
	backdrop_path: string | null;
	id: number;
	title?: string;
	original_title?: string;
	name?: string;
	overview: string;
	poster_path: string | null;
	media_type: string;
	adult: boolean;
	original_language: string;
	genre_ids: number[];
	popularity: number;
	release_date?: string;
	video?: boolean;
	vote_average: number;
	vote_count: number;
}
