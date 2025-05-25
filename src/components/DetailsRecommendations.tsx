import React from "react";
import { getImageUrl } from "@/lib/tmdb";

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
						className="flex flex-col items-center min-w-[120px] hover:opacity-80 transition"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<img
							src={getImageUrl(rec.poster_path || "")}
							alt={rec.title || rec.name}
							className="rounded-lg w-[96px] h-[140px] object-cover mb-2"
						/>
						<div className="font-semibold text-sm text-center">
							{rec.title || rec.name}
						</div>
						<div className="text-xs text-gray-400 text-center">
							{rec.vote_average
								? `${Math.round(rec.vote_average * 10)}%`
								: ""}
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
