import React, { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { getImageUrl } from "@/lib/tmdb";

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

	const renderTabContent = () => {
		if (activeTab === "popular") {
			// Show a mix of most popular images and videos
			if (loadingVideos || loadingImages) return <Spinner />;
			const firstBackdrop = images?.backdrops?.[0];
			const firstVideo = videos?.[0];
			return (
				<div className="flex gap-4">
					{firstVideo && (
						<div className="relative w-1/2 aspect-video rounded-lg overflow-hidden">
							<img
								src={`https://img.youtube.com/vi/${firstVideo.key}/hqdefault.jpg`}
								alt={firstVideo.name}
								className="w-full h-full object-cover"
							/>
							<a
								href={`https://youtube.com/watch?v=${firstVideo.key}`}
								target="_blank"
								rel="noopener noreferrer"
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
							</a>
						</div>
					)}
					{firstBackdrop && (
						<div className="w-1/2 aspect-video rounded-lg overflow-hidden">
							<img
								src={getImageUrl(
									firstBackdrop.file_path,
									"w500"
								)}
								alt="Backdrop"
								className="w-full h-full object-cover"
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
						<a
							href={`https://youtube.com/watch?v=${video.key}`}
							target="_blank"
							rel="noopener noreferrer"
							key={video.id}
							className="relative min-w-[320px] aspect-video rounded-lg overflow-hidden"
						>
							<img
								src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
								alt={video.name}
								className="w-full h-full object-cover"
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
						</a>
					))}
				</div>
			);
		}
		if (activeTab === "backdrops") {
			if (loadingImages) return <Spinner />;
			return (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{images?.backdrops?.map((img: ImageItem) => (
						<img
							key={img.file_path}
							src={getImageUrl(img.file_path, "w500")}
							alt="Backdrop"
							className="rounded-lg min-w-[320px] h-[180px] object-cover"
						/>
					))}
				</div>
			);
		}
		if (activeTab === "posters") {
			if (loadingImages) return <Spinner />;
			return (
				<div className="flex gap-4 overflow-x-auto hide-scrollbar">
					{images?.posters?.map((img: ImageItem) => (
						<img
							key={img.file_path}
							src={getImageUrl(img.file_path, "w500")}
							alt="Poster"
							className="rounded-lg min-w-[120px] h-[180px] object-cover"
						/>
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
		</div>
	);
}
