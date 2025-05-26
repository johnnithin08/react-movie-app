import React, { FunctionComponent } from "react";
import Link from "next/link";
import { CircularRating } from "./CircularRating";
import { getImageUrl } from "@/lib/tmdb";
import { Movie, TV } from '@/lib/tmdb';

interface IMovieCardProps {
	item: Movie | TV;
}

function isTV(item: Movie | TV): item is TV {
	return "name" in item;
}

export const MovieCard: FunctionComponent<IMovieCardProps> = ({
	item,
}: IMovieCardProps) => {
	const title = isTV(item) ? item.name : item.title;
	const { vote_average, poster_path } = item;
	const date = isTV(item) ? item.first_air_date : item.release_date;

	return (
		<Link
			href={`/details/${isTV(item) ? "tv" : "movie"}/${item.id}`}
			className="relative min-w-[180px] flex-shrink-0 cursor-pointer hover:opacity-80 transition"
		>
			<img
				src={poster_path ? getImageUrl(poster_path) : "/no-movie.png"}
				alt={title}
				className="rounded-lg shadow-lg h-[270px] object-cover"
			/>
			<div className="absolute left-1 bottom-10">
				<CircularRating value={vote_average * 10} size={40} />
			</div>
			<div className="mt-6 font-semibold truncate w-[170px]">
				{title}
			</div>
			<div className="text-xs text-gray-400">
				{date ? date.split("-")[0] : "N/A"}
			</div>
		</Link>
	);
};