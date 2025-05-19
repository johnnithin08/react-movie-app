"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "react-use";
import { useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { Search } from "@/components/Search";
import { Spinner } from "@/components/Spinner";
import { tmdbEndpoints, getImageUrl, type MovieResponse } from "@/lib/tmdb";
import { CircularRating } from "@/components/CircularRating";
import { TrendingSection } from "@/components/TrendingSection";
import { TrailerSection } from "@/components/TrailerSection";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_API_BASE = "https://api.themoviedb.org/3";

const fetchMovies = async (endpoint: string) => {
	const response = await fetch(endpoint, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!response.ok) throw new Error("Failed to fetch movies");
	return response.json() as Promise<MovieResponse>;
};

export default function Home() {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [trendingPeriod, setTrendingPeriod] = useState<"day" | "week">("day");

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm]);

	const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
		queryKey: ["popular"],
		queryFn: () => fetchMovies(tmdbEndpoints.popular),
	});

	const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
		queryKey: ["search", debouncedSearchTerm],
		queryFn: () => fetchMovies(tmdbEndpoints.search(debouncedSearchTerm)),
		enabled: debouncedSearchTerm.length > 0,
	});

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
							Find <span className="text-gradient">Movies</span>{" "}
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
									{searchResults?.results.map((movie) => (
										<MovieCard
											key={movie.id}
											movie={movie}
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
									Popular Movies
								</h2>
								{isLoadingPopular ? (
									<Spinner />
								) : (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
										{popularMovies?.results.map((movie) => (
											<MovieCard
												key={movie.id}
												movie={movie}
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
