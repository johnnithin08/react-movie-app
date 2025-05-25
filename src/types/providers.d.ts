declare interface Provider {
	logo_path: string;
	provider_id: number;
	provider_name: string;
	display_priority: number;
}

declare interface ProviderCountry {
	link: string;
	flatrate?: Provider[];
}

declare interface ProvidersResponse {
	id: number;
	results: {
		[countryCode: string]: ProviderCountry;
	};
}
