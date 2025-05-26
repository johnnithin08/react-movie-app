"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { MediaTabs } from "@/components/MediaTabs";
import { DetailsHeader } from "@/components/DetailsHeader";
import { DetailsCast } from "@/components/DetailsCast";
import { DetailsRecommendations } from "@/components/DetailsRecommendations";
import { SeasonsSection } from "@/components/SeasonsSection";

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

async function fetchRecommendations(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/recommendations`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) return null;
	return res.json();
}

async function fetchImages(type: string, id: string) {
	const res = await fetch(`${API_BASE}/${type}/${id}/images`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch images");
	return res.json();
}

// Add RecommendationsResponse type
interface RecommendationsResponse {
	page: number;
	results: Recommendation[];
	total_pages: number;
	total_results: number;
}

export default function DetailsPage() {
	const params = useParams();
	const { type, id } = params as { type: string; id: string };
	const [modalTrailer, setModalTrailer] = useState<string | null>(null);

	const { data: details, isLoading: loadingDetails } = useQuery<Details>({
		queryKey: ["details", type, id],
		queryFn: () => fetchDetails(type, id),
		enabled: !!type && !!id,
	});
	const { data: credits, isLoading: loadingCredits } = useQuery<Credits>({
		queryKey: ["credits", type, id],
		queryFn: () => fetchCredits(type, id),
		enabled: !!type && !!id,
	});
	const { data: videos } = useQuery<VideosResponse>({
		queryKey: ["videos", type, id],
		queryFn: () => fetchVideos(type, id),
		enabled: !!type && !!id,
	});
	const { data: recommendations } = useQuery<RecommendationsResponse>({
		queryKey: ["recommendations", type, id],
		queryFn: () => fetchRecommendations(type, id),
		enabled: !!type && !!id,
	});
	const { data: images, isLoading: loadingImages } = useQuery<ImagesResponse>(
		{
			queryKey: ["images", type, id],
			queryFn: () => fetchImages(type, id),
			enabled: !!type && !!id,
		}
	);

	if (loadingDetails || !details)
		return (
			<div className="p-10 text-center flex justify-center items-center">
				<Spinner />
			</div>
		);

	const trailer =
		videos?.results?.find(
			(v) => v.type === "Trailer" && v.site === "YouTube"
		) ?? null;
	const creators: Creator[] = [
		...(details.created_by || []),
		...(credits?.crew || [])
			.filter((c) => c.job === "Director" || c.job === "Creator")
			.map((c) => ({
				id: c.id,
				name: c.name,
				job: c.job,
				credit_id: "",
				original_name: c.name,
				gender: 0,
				profile_path: null,
			})),
	];
	const cast: CreditCast[] = credits?.cast || [];
	const genres: Genre[] = details.genres || [];
	const companies: Company[] = details.production_companies || [];
	const facts: { label: string; value: string }[] = [
		{ label: "Status", value: details.status ? details.status : undefined },
		{ label: "Type", value: details.type ? details.type : undefined },
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
		{
			label: "Seasons",
			value:
				details.number_of_seasons !== undefined
					? String(details.number_of_seasons)
					: undefined,
		},
		{
			label: "Episodes",
			value:
				details.number_of_episodes !== undefined
					? String(details.number_of_episodes)
					: undefined,
		},
	].filter((f) => f.value !== undefined) as {
		label: string;
		value: string;
	}[];
	const recs: Recommendation[] = recommendations?.results || [];

	return (
		<div className="min-h-screen bg-[#232323] text-white px-6 py-10 flex flex-col items-center relative">
			<div className="pattern fixed inset-0 w-screen h-screen z-0" />
			<div className="relative w-full flex flex-col items-center">
				<DetailsHeader
					details={details}
					genres={genres}
					creators={creators}
					facts={facts}
					companies={companies}
					trailer={trailer ? { key: trailer.key } : null}
					setModalTrailer={setModalTrailer}
				/>
				{/* <DetailsFacts facts={facts} companies={companies} /> */}
				<DetailsCast cast={cast} loadingCredits={loadingCredits} />
				{type === "tv" && details.seasons && (
					<SeasonsSection
						showId={details.id}
						seasons={details.seasons}
					/>
				)}
				{/* Media Section */}
				<div className="w-full max-w-6xl mt-12">
					<h2 className="text-2xl font-bold mb-4">Media</h2>
					<MediaTabs
						videos={videos?.results || []}
						images={images || { backdrops: [], posters: [] }}
						loadingVideos={videos === undefined}
						loadingImages={loadingImages}
					/>
				</div>
				<DetailsRecommendations recs={recs} />
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
