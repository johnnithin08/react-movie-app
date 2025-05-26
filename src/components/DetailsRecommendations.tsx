import React from "react";
import { getImageUrl } from "@/lib/tmdb";
import { CircularRating } from "./CircularRating";

export function DetailsRecommendations({ recs }: { recs: Recommendation[] }) {
	if (!recs.length) return null;
	return (
		<div className="w-full max-w-6xl mt-12">
			<h2 className="text-2xl font-bold mb-4">Recommendations</h2>
			<div className="flex gap-4 overflow-x-auto hide-scrollbar">
				{recs.slice(0, 10).map((rec: Recommendation) => (
					<a
						href={`/details/${rec.media_type}/${rec.id}`}
						key={rec.id}
						className="flex flex-col items-center min-w-[160px] hover:opacity-80 transition cursor-pointer relative"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<img
							src={getImageUrl(rec.poster_path || "")}
							alt={rec.title || rec.name}
							className="rounded-lg w-[120px] aspect-[0.7] object-cover mb-2"
						/>
						<div className="absolute left-2 bottom-15">
							<CircularRating
								value={rec.vote_average * 10}
								size={40}
							/>
						</div>
						<div className="font-semibold text-sm text-center mt-6">
							{rec.title || rec.name}
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
