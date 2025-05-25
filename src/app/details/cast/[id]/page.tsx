"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/tmdb";
import React from "react";
import { Spinner } from "@/components/Spinner";

const API_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchPerson(id: string) {
	const res = await fetch(`${API_BASE}/person/${id}`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch person details");
	return res.json();
}

async function fetchPersonCombinedCredits(id: string) {
	const res = await fetch(`${API_BASE}/person/${id}/combined_credits`, {
		headers: { Authorization: `Bearer ${API_KEY}` },
	});
	if (!res.ok) throw new Error("Failed to fetch person credits");
	return res.json();
}

export default function CastDetailsPage() {
	const params = useParams();
	const { id } = params as { id: string };

	const { data: person, isLoading: loadingPerson } = useQuery({
		queryKey: ["person", id],
		queryFn: () => fetchPerson(id),
		enabled: !!id,
	});
	const { data: credits, isLoading: loadingCredits } =
		useQuery<CombinedCreditsResponse>({
			queryKey: ["personCredits", id],
			queryFn: () => fetchPersonCombinedCredits(id),
			enabled: !!id,
		});

	if (loadingPerson || !person)
		return (
			<div className="p-10 text-center flex justify-center items-center">
				<Spinner />
			</div>
		);

	const knownFor = (credits?.cast || [])
		.sort(
			(a: CombinedCreditCast, b: CombinedCreditCast) =>
				(b.popularity || 0) - (a.popularity || 0)
		)
		.slice(0, 8);

	return (
		<div className="min-h-screen bg-[#232323] text-white px-6 py-10 flex flex-col items-center relative">
			<div className="pattern fixed inset-0 w-screen h-screen z-0" />
			<div className="relative w-full flex flex-col items-center">
				<div className="relative w-full max-w-6xl flex flex-col md:flex-row gap-8">
					{/* Profile Image */}
					<div className="flex-shrink-0">
						<img
							src={getImageUrl(person.profile_path || "")}
							alt={person.name}
							className="rounded-2xl w-[260px] h-[340px] object-cover shadow-lg"
						/>
					</div>
					{/* Main Info */}
					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2">
							{person.name}
						</h1>
						<h2 className="font-bold text-lg mb-2">Biography</h2>
						<div
							className="text-gray-200 mb-4"
							style={{ maxHeight: 200, overflow: "auto" }}
						>
							{person.biography || "No biography available."}
						</div>
						<div className="mb-4">
							<span className="font-bold">Personal Info</span>
							<ul className="text-sm text-gray-300 mt-2 space-y-1">
								<li>
									<span className="font-semibold text-white">
										Known For:
									</span>{" "}
									{person.known_for_department}
								</li>
								<li>
									<span className="font-semibold text-white">
										Birthday:
									</span>{" "}
									{person.birthday}
								</li>
								{person.place_of_birth && (
									<li>
										<span className="font-semibold text-white">
											Place of Birth:
										</span>{" "}
										{person.place_of_birth}
									</li>
								)}
								{person.deathday && (
									<li>
										<span className="font-semibold text-white">
											Died:
										</span>{" "}
										{person.deathday}
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
				{/* Known For */}
				<div className="w-full max-w-6xl mt-12">
					<h2 className="text-2xl font-bold mb-4">Known For</h2>
					{loadingCredits ? (
						<div className="flex justify-center items-center h-32 w-full">
							<Spinner />
						</div>
					) : (
						<div className="flex gap-4 overflow-x-auto hide-scrollbar">
							{knownFor.map((work: CombinedCreditCast) => (
								<a
									href={`/details/${work.media_type}/${work.id}`}
									key={work.id}
									className="flex flex-col items-center min-w-[120px] hover:opacity-80 transition"
									style={{
										textDecoration: "none",
										color: "inherit",
									}}
								>
									<img
										src={getImageUrl(
											work.poster_path || ""
										)}
										alt={work.title || work.name}
										className="rounded-lg w-[96px] h-[140px] object-cover mb-2"
									/>
									<div className="font-semibold text-sm text-center">
										{work.title || work.name}
									</div>
									<div className="text-xs text-gray-400 text-center">
										{work.media_type === "movie"
											? "Movie"
											: "TV"}
									</div>
								</a>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
