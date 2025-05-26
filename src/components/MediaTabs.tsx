import React, { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";

interface MediaTabsProps {
	videos: VideoItem[];
	images: ImagesResponse;
	loadingVideos: boolean;
	loadingImages: boolean;
}

const tabList = [
	{ key: "popular", label: "Most Popular" },
	{ key: "videos", label: "Videos" },
	{ key: "backdrops", label: "Backdrops" },
	{ key: "posters", label: "Posters" },
];

export function MediaTabs({
	videos,
	images,
	loadingVideos,
	loadingImages,
}: MediaTabsProps) {
	const [activeTab, setActiveTab] = useState("popular");
	const [modalVideo, setModalVideo] = useState<{
		key: string;
		title: string;
	} | null>(null);

	const renderTabContent = () => {
		if (activeTab === "popular") {
			if (loadingVideos || loadingImages) return <Spinner />;
			const firstBackdrop = images?.backdrops?.[0];
			const firstVideo = videos?.[0];
			return (
				<div className="flex gap-4">
					{firstVideo && (
						<div className="relative w-1/2 aspect-video rounded-lg overflow-hidden">
							<Image
								src={`https://img.youtube.com/vi/${firstVideo.key}/hqdefault.jpg`}
								alt={firstVideo.name}
								fill
								sizes="(max-width: 768px) 50vw, 33vw"
								className="object-cover"
								priority={false}
							/>
							<button
								onClick={() =>
									setModalVideo({
										key: firstVideo.key,
										title: firstVideo.name,
									})
								}
								className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
							>
								<span className="bg-white/80 rounded-full p-4">
									<svg
										width="40"
										height="40"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<polygon
											points="9.5,7.5 16.5,12 9.5,16.5"
											fill="#222"
										/>
									</svg>
								</span>
							</button>
						</div>
					)}
					{firstBackdrop && (
						<div className="relative w-1/2 aspect-video rounded-lg overflow-hidden">
							<Image
								src={getImageUrl(firstBackdrop.file_path)}
								alt="Backdrop"
								fill
								sizes="(max-width: 768px) 50vw, 33vw"
								className="object-cover"
								priority={false}
							/>
						</div>
					)}
				</div>
			);
		}
		if (activeTab === "videos") {
			if (loadingVideos) return <Spinner />;
			return (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{videos.map((video) => (
						<button
							key={video.id}
							onClick={() =>
								setModalVideo({
									key: video.key,
									title: video.name,
								})
							}
							className="relative min-w-[320px] aspect-video rounded-lg overflow-hidden"
						>
							<Image
								src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
								alt={video.name}
								fill
								sizes="320px"
								className="object-cover"
								priority={false}
							/>
							<span className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition">
								<svg
									width="40"
									height="40"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<polygon
										points="9.5,7.5 16.5,12 9.5,16.5"
										fill="#fff"
									/>
								</svg>
							</span>
						</button>
					))}
				</div>
			);
		}
		if (activeTab === "backdrops") {
			if (loadingImages) return <Spinner />;
			return (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{images?.backdrops?.map((img: ImageItem) => (
						<div
							key={img.file_path}
							className="relative min-w-[320px] h-[180px]"
						>
							<Image
								src={getImageUrl(img.file_path)}
								alt="Backdrop"
								fill
								sizes="320px"
								className="rounded-lg object-cover"
								priority={false}
							/>
						</div>
					))}
				</div>
			);
		}
		if (activeTab === "posters") {
			if (loadingImages) return <Spinner />;
			return (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{images?.posters?.map((img: ImageItem) => (
						<div
							key={img.file_path}
							className="relative min-w-[120px] h-[180px]"
						>
							<Image
								src={getImageUrl(img.file_path)}
								alt="Poster"
								fill
								sizes="120px"
								className="rounded-lg object-cover"
								priority={false}
							/>
						</div>
					))}
				</div>
			);
		}
		return null;
	};

	return (
		<div>
			<div className="flex gap-8 border-b border-gray-700 mb-4">
				{tabList.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`pb-2 px-2 font-semibold text-lg border-b-2 transition-all ${
							activeTab === tab.key
								? "border-white text-white"
								: "border-transparent text-gray-400 hover:text-white"
						}`}
					>
						{tab.label}
						{tab.key === "videos" && videos?.length > 0 && (
							<span className="ml-1 text-gray-400 font-normal text-base">
								{videos.length}
							</span>
						)}
						{tab.key === "backdrops" &&
							images?.backdrops?.length > 0 && (
								<span className="ml-1 text-gray-400 font-normal text-base">
									{images.backdrops.length}
								</span>
							)}
						{tab.key === "posters" &&
							images?.posters?.length > 0 && (
								<span className="ml-1 text-gray-400 font-normal text-base">
									{images.posters.length}
								</span>
							)}
					</button>
				))}
			</div>
			{renderTabContent()}

			{modalVideo && (
				<div
					className="fixed inset-0 backdrop-blur-sm bg-black/60 z-50 flex items-center justify-center p-4"
					onClick={() => setModalVideo(null)}
				>
					<div
						className="relative w-full max-w-4xl aspect-video"
						onClick={(e) => e.stopPropagation()}
					>
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube.com/embed/${modalVideo.key}?autoplay=1`}
							title={modalVideo.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="rounded-lg"
						/>
						<button
							className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
							onClick={() => setModalVideo(null)}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									d="M18 6L6 18M6 6l12 12"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
