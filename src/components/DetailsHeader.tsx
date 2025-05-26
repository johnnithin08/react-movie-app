import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { CircularRating } from "@/components/CircularRating";
import { DetailsFacts } from "@/components/DetailsFacts";
import React from "react";

interface Genre {
	id: number;
	name: string;
}
interface Creator {
	id: number;
	name: string;
	job?: string;
}
interface DetailsHeaderProps {
	details: Details;
	genres: Genre[];
	creators: Creator[];
	trailer: { key: string } | null;
	setModalTrailer: (key: string | null) => void;
	facts: { label: string; value: string }[];
	companies: Company[];
}

export function DetailsHeader({
	details,
	genres,
	creators,
	trailer,
	setModalTrailer,
	facts,
	companies,
}: DetailsHeaderProps) {
	return (
		<div className="relative w-full max-w-6xl">
			{details.backdrop_path && (
				<>
					<div
						className="absolute inset-0 w-full h-full z-0 rounded-lg"
						style={{
							backgroundImage: `url(${getImageUrl(
								details.backdrop_path,
								"original"
							)})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							opacity: 1,
						}}
					/>
					<div className="absolute inset-0 w-full h-full z-0 bg-black/60 rounded-lg" />
				</>
			)}
			<div className="relative z-10 flex flex-col md:flex-row gap-8 w-full p-5">
				<div className="w-full md:w-64 flex-shrink-0">
					<div className="relative w-full aspect-[2/3]">
						<Image
							src={getImageUrl(details.poster_path || "")}
							alt={details.title || details.name || ""}
							fill
							sizes="(max-width: 768px) 100vw, 256px"
							className="rounded-lg object-cover"
							priority={true}
						/>
					</div>
				</div>
				<div className="flex-1 flex flex-col md:flex-row gap-8">
					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2">
							{details.title || details.name}{" "}
							<span className="text-gray-400 font-normal">
								(
								{(
									details.release_date ||
									details.first_air_date ||
									""
								).slice(0, 4)}
								)
							</span>
						</h1>
						<div className="flex items-center gap-2 mb-2">
							{details.adult && (
								<span className="border  rounded-full p-1.5 text-xs">
									18+
								</span>
							)}
							{genres.map((g) => (
								<span
									key={g.id}
									className="text-sm text-gray-300 mr-2"
								>
									{g.name}
								</span>
							))}
						</div>
						<div className="flex items-center gap-6 mb-4">
							<div className="flex items-center gap-2">
								<CircularRating
									value={details.vote_average * 10}
									size={56}
								/>
								<span className="text-sm text-gray-300">
									User Score
								</span>
							</div>
							<button
								className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
								onClick={() =>
									trailer && setModalTrailer(trailer.key)
								}
								disabled={!trailer}
							>
								▶ Play Trailer
							</button>
						</div>
						<div className="italic text-gray-200 mb-2">
							{details.tagline}
						</div>
						<div className="mb-2">
							<span className="font-bold">Overview</span>
							<div className="text-gray-200 mt-1">
								{details.overview}
							</div>
						</div>
						<div className="flex gap-8 mt-6 flex-wrap">
							{creators.map((c) => (
								<div key={c.id} className="text-center">
									<div className="font-bold">{c.name}</div>
									<div className="text-xs text-gray-400">
										{c.job || "Creator"}
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="w-full md:w-64 flex-shrink-0">
						{/* Facts and Production */}
						<DetailsFacts facts={facts} companies={companies} />
					</div>
				</div>
			</div>
		</div>
	);
}
