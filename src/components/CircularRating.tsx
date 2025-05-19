import React from "react";

function getColor(score: number) {
	if (score >= 75) return "#21d07a"; // green
	if (score >= 50) return "#d2d531"; // yellow
	if (score >= 30) return "#ffa500"; // orange
	return "#db2360"; // red
}

export function CircularRating({
	value,
	size = 40,
}: {
	value: number;
	size?: number;
}) {
	const radius = size / 2 - 4;
	const circumference = 2 * Math.PI * radius;
	const percent = Math.max(0, Math.min(100, value));
	const offset = circumference - (percent / 100) * circumference;
	const color = getColor(percent);

	return (
		<svg width={size} height={size} className="block">
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="#081c22"
				stroke="#204529"
				strokeWidth="4"
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke={color}
				strokeWidth="4"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				style={{
					transition: "stroke-dashoffset 0.35s",
					transform: `rotate(-90deg)`,
					transformOrigin: "50% 50%",
				}}
			/>
			<text
				x="50%"
				y="50%"
				textAnchor="middle"
				dy="0.35em"
				fontSize={size * 0.4}
				fontWeight="bold"
				fill="white"
			>
				{Math.round(percent)}
			</text>
		</svg>
	);
}
