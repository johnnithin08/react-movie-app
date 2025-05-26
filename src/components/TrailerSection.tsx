import { getImageUrl } from "@/lib/tmdb";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";

const trailerFilters = ["Popular", "Streaming", "On TV", "In Theatres"];

const filterToEndpoint = (filter: string) => {
	const API_BASE = "https://api.themoviedb.org/3";
	switch (filter) {
		case "Popular":
			return `${API_BASE}/movie/popular`;
		case "Streaming":
			return `${API_BASE}/discover/movie?with_watch_providers=8&watch_region=US`;
		case "On TV":
			return `${API_BASE}/discover/tv?language=en-US&page=1&sort_by=first_air_date.desc&watch_region=US&with_watch_providers=8`;
		case "In Theatres":
			return `${API_BASE}/movie/now_playing`;
		default:
			return `${API_BASE}/movie/popular`;
	}
};

const fetchMovies = async (endpoint: string, apiKey: string) => {
	const response = await fetch(endpoint, {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	if (!response.ok) throw new Error("Failed to fetch movies");
	return response.json() as Promise<DiscoverResponse>;
};

const fetchTrailer = async (movieId: number, apiKey: string, isTV: boolean) => {
	const API_BASE = "https://api.themoviedb.org/3";
	const url = isTV
		? `${API_BASE}/tv/${movieId}/videos`
		: `${API_BASE}/movie/${movieId}/videos`;
	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${apiKey}` },
	});
	if (!response.ok) return null;
	const data = await response.json();
	const trailer = data.results?.find(
		(v: { type: string; site: string }) =>
			v.type === "Trailer" && v.site === "YouTube"
	);
	return trailer ? trailer.key : null;
};

export function TrailerSection() {
	const [trailerFilter, setTrailerFilter] = useState("Popular");
	const [modalTrailer, setModalTrailer] = useState<{
		key: string;
		title: string;
	} | null>(null);
	const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

	const endpoint = filterToEndpoint(trailerFilter);
	const { data: moviesData, isLoading } = useQuery<DiscoverResponse>({
		queryKey: ["trailers", trailerFilter],
		queryFn: () => fetchMovies(endpoint, API_KEY!),
	});

	// Fetch trailers for the first 4 items
	const [trailers, setTrailers] = useState<{ [id: number]: string | null }>(
		{}
	);
	React.useEffect(() => {
		if (!moviesData?.results) return;
		const fetchAll = async () => {
			const entries = await Promise.all(
				moviesData.results
					.slice(0, 4)
					.map(async (item) => [
						item.id,
						await fetchTrailer(
							item.id,
							API_KEY!,
							trailerFilter === "On TV"
						),
					])
			);
			setTrailers(Object.fromEntries(entries));
		};
		fetchAll();
	}, [moviesData, API_KEY, trailerFilter]);

	return (
		<section className="mb-12">
			<div className="flex items-center gap-4 mb-4">
				<h2 className="text-2xl font-bold mr-4">Latest Trailers</h2>
				<div className="flex rounded-full bg-gray-800 p-1">
					{trailerFilters.map((filter) => (
						<button
							key={filter}
							className={`px-4 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
								trailerFilter === filter
									? "bg-white text-black shadow"
									: "text-white"
							}`}
							onClick={() => setTrailerFilter(filter)}
						>
							{filter}
						</button>
					))}
				</div>
			</div>
			{isLoading ? (
				<div className="flex justify-center items-center h-32 w-full">
					<Spinner />
				</div>
			) : (
				<div className="flex overflow-x-auto gap-6 pb-2 hide-scrollbar">
					{moviesData?.results.slice(0, 4).map((item) => (
						<div
							key={item.id}
							className="relative min-w-[300px] max-w-[300px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-900 cursor-pointer hover:opacity-80 transition"
						>
							<Link
								href={`/details/${
									trailerFilter === "On TV" ? "tv" : "movie"
								}/${item.id}`}
								className="block"
							>
								<img
									src={getImageUrl(
										item.backdrop_path ||
											item.poster_path ||
											"",
										"w500"
									)}
									alt={item.name || item.title || ""}
									className="w-full h-[170px] object-cover"
								/>
							</Link>
							{trailers[item.id] && (
								<button
									className="absolute inset-0 flex items-center justify-center"
									onClick={() =>
										setModalTrailer({
											key: trailers[item.id]!,
											title:
												item.name || item.title || "",
										})
									}
								>
									<span className="bg-white bg-opacity-80 rounded-full p-3">
										<svg
											width="32"
											height="32"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<polygon
												points="9.5,7.5 16.5,12 9.5,16.5"
												fill="#222"
											/>
										</svg>
									</span>
								</button>
							)}
							<div className="p-3 text-center">
								<Link
									href={`/details/${
										trailerFilter === "On TV"
											? "tv"
											: "movie"
									}/${item.id}`}
									className="font-bold text-white text-lg block hover:underline"
								>
									{item.name || item.title || ""}
								</Link>
								<div className="text-gray-300 text-sm truncate">
									{item.overview}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
