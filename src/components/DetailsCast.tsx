import React from "react";
import Image from "next/image";
import { Spinner } from "@/components/Spinner";
import { getImageUrl } from "@/lib/tmdb";

export function DetailsCast({
	cast,
	loadingCredits,
}: {
	cast: CreditCast[];
	loadingCredits: boolean;
}) {
	return (
		<div className="w-full max-w-6xl mt-12">
			<h2 className="text-2xl font-bold mb-4">Cast</h2>
			{loadingCredits ? (
				<div className="flex justify-center items-center h-32 w-full">
					<Spinner />
				</div>
			) : (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{cast.slice(0, 10).map((actor) => (
						<a
							href={`/details/cast/${actor.id}`}
							key={actor.id}
							className="flex flex-col items-center min-w-[120px] hover:opacity-80 transition cursor-pointer"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<div className="relative w-[96px] h-[120px] mb-2">
								<Image
									src={getImageUrl(actor.profile_path || "")}
									alt={actor.name}
									fill
									sizes="96px"
									className="rounded-lg object-cover"
									priority={false}
								/>
							</div>
							<div className="font-semibold text-sm text-center">
								{actor.name}
							</div>
							<div className="text-xs text-gray-400 text-center">
								{actor.character}
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
}
