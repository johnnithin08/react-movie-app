import { CircularRating } from "@/components/CircularRating";
import { getImageUrl } from "@/lib/tmdb";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";

interface TrendingSectionProps {
	trendingPeriod: "day" | "week";
	setTrendingPeriod: (period: "day" | "week") => void;
}

// Define types for Movie and TV
interface TrendingMovie {
	id: number;
	poster_path: string | null;
	title: string;
	vote_average: number;
	release_date: string;
}
interface TrendingTV {
	id: number;
	poster_path: string | null;
	name: string;
	vote_average: number;
	first_air_date: string;
}
type TrendingItem = TrendingMovie | TrendingTV;

function isTV(item: TrendingItem): item is TrendingTV {
	return (item as TrendingTV).name !== undefined;
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
		return response.json() as Promise<{ results: TrendingItem[] }>;
	};

	const { data: trendingMovies, isLoading: isLoadingMovies } = useQuery({
		queryKey: ["trending-movies", trendingPeriod],
		queryFn: () =>
			fetchMovies(`${TMDB_API_BASE}/trending/movie/${trendingPeriod}`),
	});

	const { data: trendingTV, isLoading: isLoadingTV } = useQuery({
		queryKey: ["trending-tv", trendingPeriod],
		queryFn: () =>
			fetchMovies(`${TMDB_API_BASE}/trending/tv/${trendingPeriod}`),
	});

	const isLoadingTrending = isLoadingMovies || isLoadingTV;
	const combined: TrendingItem[] = [
		...(trendingMovies?.results || []),
		...(trendingTV?.results || []),
	];

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
					<Spinner />
				</div>
			) : (
				<div className="flex overflow-x-auto gap-6 pb-2 hide-scrollbar">
					{combined.map((item) => (
						<Link
							key={item.id}
							href={`/details/${isTV(item) ? "tv" : "movie"}/${
								item.id
							}`}
							className="relative min-w-[180px] flex-shrink-0"
						>
							<img
								src={getImageUrl(item.poster_path || "")}
								alt={isTV(item) ? item.name : item.title}
								className="rounded-lg shadow-lg w-full h-[270px] object-cover"
							/>
							<div className="absolute left-1 bottom-10">
								<CircularRating
									value={item.vote_average * 10}
									size={40}
								/>
							</div>
							<div className="mt-6 font-semibold truncate w-[170px]">
								{isTV(item) ? item.name : item.title}
							</div>
							<div className="text-xs text-gray-400">
								{isTV(item)
									? item.first_air_date
									: item.release_date}
							</div>
						</Link>
					))}
				</div>
			)}
		</section>
	);
}
