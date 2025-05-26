import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";

export function DetailsFacts({
	facts,
	companies,
}: {
	facts: { label: string; value: string }[];
	companies: Company[];
}) {
	return (
		<div className="w-full md:w-64 flex flex-col gap-6 mt-8 md:mt-0">
			<div className="bg-gray-800 rounded-lg p-4">
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
				<div className="bg-gray-800 rounded-lg p-4">
					<h3 className="font-bold mb-2">Production</h3>
					<div className="flex flex-wrap gap-2 items-center">
						{companies.map((c) => (
							<span
								key={c.id}
								className="flex items-center gap-1"
							>
								{c.logo_path && (
									<div className="relative w-8 h-8">
										<Image
											src={getImageUrl(c.logo_path)}
											alt={c.name}
											fill
											sizes="32px"
											className="object-contain"
											priority={false}
										/>
									</div>
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
	);
}
