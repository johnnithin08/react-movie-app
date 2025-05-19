import { CircularRating } from "@/components/CircularRating";
import { getImageUrl, MovieResponse } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";

interface TrendingSectionProps {
	trendingPeriod: "day" | "week";
	setTrendingPeriod: (period: "day" | "week") => void;
}

export function TrendingSection({
	trendingPeriod,
	setTrendingPeriod,
}: TrendingSectionProps) {
	const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
	const TMDB_API_BASE = "https://api.themoviedb.org/3";

	const fetchMovies = async (endpoint: string) => {
		const response = await fetch(endpoint, {
			headers: { Authorization: `Bearer ${API_KEY}` },
		});
		if (!response.ok) throw new Error("Failed to fetch movies");
		return response.json() as Promise<MovieResponse>;
	};

	const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
		queryKey: ["trending", trendingPeriod],
		queryFn: () =>
			fetchMovies(`${TMDB_API_BASE}/trending/movie/${trendingPeriod}`),
	});

	return (
		<section className="mb-12">
			<div className="flex items-center gap-4 mb-4">
				<h2 className="text-2xl font-bold mr-4">Trending</h2>
				<div className="flex rounded-full bg-gray-800 p-1">
					<button
						className={`px-4 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
							trendingPeriod === "day"
								? "bg-white text-black shadow"
								: "text-white"
						}`}
						onClick={() => setTrendingPeriod("day")}
					>
						Today
					</button>
					<button
						className={`px-4 py-1 rounded-full transition-colors duration-200 text-sm font-medium ${
							trendingPeriod === "week"
								? "bg-white text-black shadow"
								: "text-white"
						}`}
						onClick={() => setTrendingPeriod("week")}
					>
						This Week
					</button>
				</div>
			</div>
			{isLoadingTrending ? (
				<div className="flex justify-center items-center h-32 w-full">
					<span>Loading...</span>
				</div>
			) : (
				<div className="flex overflow-x-auto gap-6 pb-2 hide-scrollbar">
					{trendingMovies?.results.map((movie: any) => (
						<div
							key={movie.id}
							className="relative min-w-[180px] flex-shrink-0"
						>
							<img
								src={getImageUrl(movie.poster_path)}
								alt={movie.title}
								className="rounded-lg shadow-lg w-full h-[270px] object-cover"
							/>
							<div className="absolute left-1 bottom-10">
								<CircularRating
									value={movie.vote_average * 10}
									size={40}
								/>
							</div>
							<div className="mt-6 font-semibold truncate w-[170px]">
								{movie.title}
							</div>
							<div className="text-xs text-gray-400">
								{movie.release_date}
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
