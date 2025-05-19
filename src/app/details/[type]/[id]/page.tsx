"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/tmdb";
import { CircularRating } from "@/components/CircularRating";
import React, { useState } from "react";

const API_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchDetails(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch details");
	return res.json();
}

async function fetchCredits(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/credits`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch credits");
	return res.json();
}

async function fetchVideos(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/videos`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch videos");
	return res.json();
}

async function fetchProviders(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/watch/providers`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) return null;
	return res.json();
}

async function fetchExternalIds(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/external_ids`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) return null;
	return res.json();
}

async function fetchRecommendations(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/recommendations`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) return null;
	return res.json();
}

export default function DetailsPage() {
	const params = useParams();
	const { type, id } = params as { type: string; id: string };
	const [modalTrailer, setModalTrailer] = useState<string | null>(null);

	const { data: details, isLoading: loadingDetails } = useQuery({
		queryKey: ["details", type, id],
		queryFn: () => fetchDetails(type, id),
		enabled: !!type && !!id,
	});
	const { data: credits, isLoading: loadingCredits } = useQuery({
		queryKey: ["credits", type, id],
		queryFn: () => fetchCredits(type, id),
		enabled: !!type && !!id,
	});
	const { data: videos } = useQuery({
		queryKey: ["videos", type, id],
		queryFn: () => fetchVideos(type, id),
		enabled: !!type && !!id,
	});
	const { data: providers } = useQuery({
		queryKey: ["providers", type, id],
		queryFn: () => fetchProviders(type, id),
		enabled: !!type && !!id,
	});
	const { data: externalIds } = useQuery({
		queryKey: ["externalIds", type, id],
		queryFn: () => fetchExternalIds(type, id),
		enabled: !!type && !!id,
	});
	const { data: recommendations } = useQuery({
		queryKey: ["recommendations", type, id],
		queryFn: () => fetchRecommendations(type, id),
		enabled: !!type && !!id,
	});

	if (loadingDetails || !details)
		return <div className="p-10 text-center">Loading...</div>;

	const trailer = videos?.results?.find(
		(v: { type: string; site: string }) =>
			v.type === "Trailer" && v.site === "YouTube"
	);
	const creators: Creator[] = (details.created_by || []).concat(
		(credits?.crew || []).filter(
			(c: Creator) => c.job === "Director" || c.job === "Creator"
		)
	);
	const cast: Cast[] = credits?.cast || [];
	const genres: Genre[] = details.genres || [];
	const companies: Company[] = details.production_companies || [];
	const facts = [
		{ label: "Status", value: details.status },
		{ label: "Type", value: details.type },
		{ label: "Original Language", value: details.original_language },
		{
			label: "Runtime",
			value: details.runtime
				? `${details.runtime} min`
				: details.episode_run_time
				? `${details.episode_run_time[0]} min`
				: undefined,
		},
		{
			label: "Budget",
			value: details.budget
				? `$${details.budget.toLocaleString()}`
				: undefined,
		},
		{
			label: "Revenue",
			value: details.revenue
				? `$${details.revenue.toLocaleString()}`
				: undefined,
		},
		{ label: "Seasons", value: details.number_of_seasons },
		{ label: "Episodes", value: details.number_of_episodes },
	].filter((f) => f.value);
	const socialLinks = [
		{ icon: "🌐", url: details.homepage },
		{
			icon: "🎬",
			url: externalIds?.imdb_id
				? `https://imdb.com/title/${externalIds.imdb_id}`
				: undefined,
		},
		{
			icon: "🐦",
			url: externalIds?.twitter_id
				? `https://twitter.com/${externalIds.twitter_id}`
				: undefined,
		},
		{
			icon: "📸",
			url: externalIds?.instagram_id
				? `https://instagram.com/${externalIds.instagram_id}`
				: undefined,
		},
		{
			icon: "📘",
			url: externalIds?.facebook_id
				? `https://facebook.com/${externalIds.facebook_id}`
				: undefined,
		},
	].filter((l) => l.url);
	const recs: Recommendation[] = recommendations?.results || [];
	const watchProviders: Provider[] = providers?.results?.US?.flatrate || [];

	return (
		<div className="min-h-screen bg-[#232323] text-white px-6 py-10 flex flex-col items-center relative">
			<div className="pattern fixed inset-0 w-screen h-screen z-0" />
			<div className="relative w-full flex flex-col items-center">
				<div className="relative w-full max-w-6xl">
					{details.backdrop_path && (
						<>
							<div
								className="absolute inset-0 w-full h-full z-0"
								style={{
									backgroundImage: `url(${getImageUrl(
										details.backdrop_path,
										"original"
									)})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									filter: "blur(8px)",
									opacity: 1,
								}}
							/>
							<div className="absolute inset-0 w-full h-full z-0 bg-black/70" />
						</>
					)}
					<div className="relative z-10 flex flex-col md:flex-row gap-8 w-full">
						{/* Poster */}
						<div className="flex-shrink-0">
							<img
								src={getImageUrl(details.poster_path || "")}
								alt={details.title || details.name}
								className="rounded-2xl w-[260px] h-[390px] object-cover shadow-lg"
							/>
							{/* Streaming info */}
							{watchProviders.length > 0 && (
								<div className="mt-4 bg-blue-900 rounded-lg p-3 text-center flex flex-col items-center">
									<span className="font-semibold mb-2">
										Now Streaming
									</span>
									<div className="flex gap-2 flex-wrap justify-center">
										{watchProviders.map((p) => (
											<span
												key={p.provider_name}
												className="flex items-center gap-1 bg-blue-800 rounded px-2 py-1 text-xs"
											>
												<img
													src={getImageUrl(
														p.logo_path || ""
													)}
													alt={p.provider_name}
													className="w-5 h-5 inline-block"
												/>
												{p.provider_name}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
						{/* Main Info */}
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
									<span className="border px-1 rounded text-xs">
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
									className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
									onClick={() =>
										trailer && setModalTrailer(trailer.key)
									}
									disabled={!trailer}
								>
									▶ Play Trailer
								</button>
							</div>
							<div className="italic text-gray-400 mb-2">
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
										<div className="font-bold">
											{c.name}
										</div>
										<div className="text-xs text-gray-400">
											{c.job || "Creator"}
										</div>
									</div>
								))}
							</div>
						</div>
						{/* Side Facts & Social */}
						<div className="w-full md:w-64 flex flex-col gap-6 mt-8 md:mt-0">
							<div className="flex gap-3 mb-2">
								{socialLinks.map((l, i) => (
									<a
										key={i}
										href={l.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-2xl hover:opacity-80"
									>
										{l.icon}
									</a>
								))}
							</div>
							<div className="bg-[#181818] rounded-lg p-4">
								<h3 className="font-bold mb-2">Facts</h3>
								<ul className="text-sm text-gray-300 space-y-1">
									{facts.map((f, i) => (
										<li key={i}>
											<span className="font-semibold text-white">
												{f.label}:
											</span>{" "}
											{f.value}
										</li>
									))}
								</ul>
							</div>
							{companies.length > 0 && (
								<div className="bg-[#181818] rounded-lg p-4">
									<h3 className="font-bold mb-2">
										Production
									</h3>
									<div className="flex flex-wrap gap-2 items-center">
										{companies.map((c) => (
											<span
												key={c.id}
												className="flex items-center gap-1"
											>
												{c.logo_path && (
													<img
														src={getImageUrl(
															c.logo_path
														)}
														alt={c.name}
														className="w-8 h-8 object-contain"
													/>
												)}
												<span className="text-xs text-gray-300">
													{c.name}
												</span>
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Cast */}
				<div className="w-full max-w-6xl mt-12">
					<h2 className="text-2xl font-bold mb-4">Series Cast</h2>
					{loadingCredits ? (
						<div>Loading cast...</div>
					) : (
						<div className="flex gap-4 overflow-x-auto hide-scrollbar">
							{cast.slice(0, 10).map((actor) => (
								<div
									key={actor.id}
									className="flex flex-col items-center min-w-[120px]"
								>
									<img
										src={getImageUrl(
											actor.profile_path || ""
										)}
										alt={actor.name}
										className="rounded-lg w-[96px] h-[120px] object-cover mb-2"
									/>
									<div className="font-semibold text-sm text-center">
										{actor.name}
									</div>
									<div className="text-xs text-gray-400 text-center">
										{actor.character}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				{/* Recommendations */}
				{recs.length > 0 && (
					<div className="w-full max-w-6xl mt-12">
						<h2 className="text-2xl font-bold mb-4">
							Recommendations
						</h2>
						<div className="flex gap-4 overflow-x-auto hide-scrollbar">
							{recs.slice(0, 10).map((rec) => (
								<div
									key={rec.id}
									className="flex flex-col items-center min-w-[120px]"
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
											? `${Math.round(
													rec.vote_average * 10
											  )}%`
											: ""}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{/* Trailer Modal */}
				{modalTrailer && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
						onClick={() => setModalTrailer(null)}
					>
						<div
							className="bg-[#181818] rounded-lg overflow-hidden relative w-full max-w-5xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between px-4 py-2 bg-[#222] border-b border-gray-700">
								<span className="text-white font-medium text-base truncate">
									Trailer
								</span>
								<button
									className="text-white text-2xl"
									onClick={() => setModalTrailer(null)}
								>
									&times;
								</button>
							</div>
							<div className="w-full aspect-video bg-black flex items-center justify-center">
								<iframe
									width="100%"
									height="100%"
									src={`https://www.youtube.com/embed/${modalTrailer}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
