"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "react-use";
import { useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { Search } from "@/components/Search";
import { Spinner } from "@/components/Spinner";
import {
	tmdbEndpoints,
	type MultiSearchResponse,
	type MovieResponse,
	type TVResponse,
} from "@/lib/tmdb";
import { TrendingSection } from "@/components/TrendingSection";
import { TrailerSection } from "@/components/TrailerSection";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const fetchData = async (endpoint: string) => {
	const response = await fetch(endpoint, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!response.ok) throw new Error("Failed to fetch data");
	return response.json();
};

export default function Home() {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [trendingPeriod, setTrendingPeriod] = useState<"day" | "week">("day");

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm]);

	const { data: popularMovies, isLoading: isLoadingMovies } =
		useQuery<MovieResponse>({
			queryKey: ["popular-movies"],
			queryFn: () => fetchData(tmdbEndpoints.popularMovies),
		});

	const { data: popularTV, isLoading: isLoadingTV } = useQuery<TVResponse>({
		queryKey: ["popular-tv"],
		queryFn: () => fetchData(tmdbEndpoints.popularTV),
	});

	const { data: searchResults, isLoading: isLoadingSearch } =
		useQuery<MultiSearchResponse>({
			queryKey: ["search", debouncedSearchTerm],
			queryFn: () => fetchData(tmdbEndpoints.search(debouncedSearchTerm)),
			enabled: debouncedSearchTerm.length > 0,
		});

	const isLoadingPopular = isLoadingMovies || isLoadingTV;
	const popularItems = [
		...(popularMovies?.results || []),
		...(popularTV?.results || []),
	].sort((a, b) => b.popularity - a.popularity);

	return (
		<main className="min-h-screen bg-gray-900 text-white">
			<div className="pattern">
				<div className="wrapper max-w-7xl mx-auto px-4 py-8">
					<header className="text-center mb-4">
						<img
							src="./hero.png"
							alt="hero Banner"
							className="mx-auto"
						/>
						<h1 className="text-4xl font-bold mb-4">
							Find{" "}
							<span className="text-gradient">
								Movies & TV Shows
							</span>{" "}
							You&apos;ll Enjoy Without the Hassle
						</h1>
						<Search
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
						<div className="mt-4" />
					</header>

					{debouncedSearchTerm ? (
						<section className="mb-12">
							<h2 className="text-2xl font-bold mb-6">
								Search Results
							</h2>
							{isLoadingSearch ? (
								<Spinner />
							) : (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
									{searchResults?.results
										.filter(
											(item) =>
												item.media_type === "movie" ||
												item.media_type === "tv"
										)
										.map((item) => (
											<MovieCard
												key={item.id}
												item={item}
											/>
										))}
								</div>
							)}
						</section>
					) : (
						<>
							<TrendingSection
								trendingPeriod={trendingPeriod}
								setTrendingPeriod={setTrendingPeriod}
							/>
							<TrailerSection />
							<section className="mb-12">
								<h2 className="text-2xl font-bold mb-6">
									Popular Movies & TV Shows
								</h2>
								{isLoadingPopular ? (
									<Spinner />
								) : (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
										{popularItems.map((item) => (
											<MovieCard
												key={item.id}
												item={item}
											/>
										))}
									</div>
								)}
							</section>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
