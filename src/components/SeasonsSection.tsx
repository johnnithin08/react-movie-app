import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularRating } from "./CircularRating";
import { getImageUrl } from "@/lib/tmdb";
import { Spinner } from "./Spinner";
import { CustomDropdown } from "./CustomDropdown";
import Image from "next/image";

const API_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

interface SeasonsSectionProps {
	showId: number;
	seasons: {
		id: number;
		name: string;
		overview: string;
		air_date: string;
		episode_count: number;
		season_number: number;
		poster_path: string | null;
	}[];
}

interface CrewMember {
	department: string;
	job: string;
	credit_id: string;
	name: string;
	profile_path: string | null;
}

interface GuestStar {
	character: string;
	credit_id: string;
	name: string;
	profile_path: string | null;
}

interface Episode {
	id: number;
	name: string;
	overview: string;
	air_date: string;
	episode_number: number;
	season_number: number;
	still_path: string | null;
	vote_average: number;
	vote_count: number;
	runtime: number;
	crew: CrewMember[];
	guest_stars: GuestStar[];
}

interface SeasonDetails {
	_id: string;
	air_date: string;
	episodes: Episode[];
	name: string;
	overview: string;
	id: number;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}

async function fetchSeasonDetails(showId: number, seasonNumber: number) {
	const res = await fetch(`${API_BASE}/tv/${showId}/season/${seasonNumber}`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch season details");
	return res.json() as Promise<SeasonDetails>;
}

export function SeasonsSection({ showId, seasons }: SeasonsSectionProps) {
	const [selectedSeason, setSelectedSeason] = useState(1);
	const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);

	const { data: seasonDetails, isLoading } = useQuery({
		queryKey: ["season", showId, selectedSeason],
		queryFn: () => fetchSeasonDetails(showId, selectedSeason),
	});

	// Filter out season 0 and sort seasons
	const validSeasons = seasons
		.filter((season) => season.season_number > 0)
		.sort((a, b) => a.season_number - b.season_number);

	const dropdownOptions = validSeasons.map((season) => ({
		value: season.season_number,
		label:
			season.name !== `Season ${season.season_number}`
				? `${season.name} (Season ${season.season_number})`
				: `Season ${season.season_number}`,
	}));

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="max-w-6xl space-y-6 mt-12">
			<div>
				<h2 className="text-2xl font-bold mb-2">Seasons</h2>
				{seasonDetails?.overview && (
					<p className="text-gray-300 mb-4">
						{seasonDetails.overview}
					</p>
				)}
				<div className="mb-6">
					<CustomDropdown
						options={dropdownOptions}
						value={selectedSeason}
						onChange={(value) => {
							setSelectedSeason(value as number);
							setExpandedEpisode(null);
						}}
					/>
				</div>
			</div>

			{seasonDetails?.episodes.map((episode) => (
				<div
					key={episode.id}
					className="bg-gray-800 rounded-lg overflow-hidden"
				>
					<div
						className="flex gap-4 p-4 cursor-pointer"
						onClick={() =>
							setExpandedEpisode(
								expandedEpisode === episode.id
									? null
									: episode.id
							)
						}
					>
						<div className="relative aspect-video w-full md:w-64 flex-shrink-0">
							{episode.still_path ? (
								<Image
									src={getImageUrl(episode.still_path)}
									alt={episode.name}
									fill
									sizes="(max-width: 768px) 100vw, 256px"
									className="object-cover rounded-lg"
									priority={false}
								/>
							) : (
								<div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
									<span className="text-gray-400 text-sm">
										No image
									</span>
								</div>
							)}
						</div>
						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="font-bold text-lg">
										{episode.episode_number}. {episode.name}
									</h3>
									<div className="flex gap-4 text-sm text-gray-400 mt-1">
										<p>
											{episode.air_date &&
												new Date(
													episode.air_date
												).toLocaleDateString()}
										</p>
										<p>{episode.runtime} min</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<CircularRating
										value={episode.vote_average * 10}
										size={40}
									/>
								</div>
							</div>
							<p className="mt-2 text-gray-300 text-sm">
								{episode.overview || "No overview available."}
							</p>
						</div>
					</div>

					{expandedEpisode === episode.id && (
						<div className="border-t border-gray-700 p-4 bg-gray-900">
							<div className="grid grid-cols-2 gap-6">
								<div>
									<h4 className="font-semibold mb-2">Crew</h4>
									<div className="space-y-2">
										{episode.crew
											.filter(
												(member) =>
													member.job === "Director" ||
													member.job === "Writer"
											)
											.map((member) => (
												<div
													key={member.credit_id}
													className="text-sm"
												>
													<span className="text-gray-400">
														{member.job}:
													</span>{" "}
													{member.name}
												</div>
											))}
									</div>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Guest Stars
									</h4>
									<div className="space-y-2">
										{episode.guest_stars
											.slice(0, 5)
											.map((star) => (
												<div
													key={star.credit_id}
													className="text-sm"
												>
													<span className="text-gray-400">
														{star.character}
													</span>{" "}
													({star.name})
												</div>
											))}
										{episode.guest_stars.length > 5 && (
											<p className="text-sm text-gray-400">
												+{" "}
												{episode.guest_stars.length - 5}{" "}
												more
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
