declare interface Genre {
	id: number;
	name: string;
}

declare interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

declare interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

declare interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

declare interface BelongsToCollection {
	id: number;
	name: string;
	poster_path: string | null;
	backdrop_path: string | null;
}

declare interface Creator {
	id: number;
	credit_id: string;
	name: string;
	original_name: string;
	gender: number;
	profile_path: string | null;
}

declare interface Episode {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	episode_type?: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string | null;
}

declare interface Network {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

declare interface Season {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}

declare interface Details {
	// Common fields
	adult: boolean;
	backdrop_path: string | null;
	genres: Genre[];
	homepage?: string;
	id: number;
	original_language: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	production_companies?: ProductionCompany[];
	production_countries?: ProductionCountry[];
	release_date?: string;
	spoken_languages?: SpokenLanguage[];
	status?: string;
	tagline?: string;
	title?: string;
	vote_average: number;
	vote_count: number;

	// Movie-specific fields
	belongs_to_collection?: BelongsToCollection | null;
	budget?: number;
	imdb_id?: string;
	original_title?: string;
	revenue?: number;
	runtime?: number;
	video?: boolean;

	// TV-specific fields
	created_by?: Creator[];
	episode_run_time?: number[];
	first_air_date?: string;
	in_production?: boolean;
	languages?: string[];
	last_air_date?: string;
	last_episode_to_air?: Episode;
	name?: string;
	next_episode_to_air?: Episode | null;
	networks?: Network[];
	number_of_episodes?: number;
	number_of_seasons?: number;
	origin_country?: string[];
	original_name?: string;
	seasons?: {
		id: number;
		name: string;
		overview: string;
		air_date: string;
		episode_count: number;
		season_number: number;
		poster_path: string | null;
	}[];
	type?: string;
}

declare interface CreditCast {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	cast_id: number;
	character: string;
	credit_id: string;
	order: number;
}

declare interface CreditCrew {
	id: number;
	name: string;
	job: string;
}

declare interface Credits {
	id: number;
	cast: CreditCast[];
	crew?: CreditCrew[];
}

declare interface CombinedCreditCast {
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
	character?: string;
	credit_id: string;
	order?: number;
	media_type: string;
	// TV fields
	original_name?: string;
	first_air_date?: string;
	name?: string;
	episode_count?: number;
}

declare interface CombinedCreditCrew {
	id: number;
	department: string;
	original_language: string;
	original_title?: string;
	job: string;
	overview: string;
	vote_count: number;
	video?: boolean;
	poster_path: string | null;
	backdrop_path: string | null;
	popularity: number;
	genre_ids: number[];
	title?: string;
	original_name?: string;
	vote_average: number;
	credit_id: string;
	release_date?: string;
	first_air_date?: string;
	name?: string;
	media_type: string;
}

declare interface CombinedCreditsResponse {
	cast: CombinedCreditCast[];
	crew: CombinedCreditCrew[];
}

declare interface DiscoverTV {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	first_air_date: string;
	name: string;
	vote_average: number;
	vote_count: number;
}

declare interface DiscoverTVResponse {
	page: number;
	results: DiscoverTV[];
	total_pages: number;
	total_results: number;
}
