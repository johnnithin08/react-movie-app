import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
	value: string | number;
	label: string;
}

interface CustomDropdownProps {
	options: DropdownOption[];
	value: string | number;
	onChange: (value: string | number) => void;
	label?: string;
	className?: string;
}

export function CustomDropdown({
	options,
	value,
	onChange,
	label,
	className = "",
}: CustomDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div
			className={`relative ${className} max-w-[400px] w-full`}
			ref={dropdownRef}
		>
			<button
				id="dropdownDefaultButton"
				data-dropdown-toggle="dropdown"
				className="text-white bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border border-gray-700 min-w-[200px] w-full justify-between"
				type="button"
				onClick={() => setIsOpen(!isOpen)}
			>
				{label && <span className="text-gray-300 mr-2">{label}</span>}
				<span className="flex-1 text-left">
					{selectedOption?.label || "Select an option"}
				</span>
				<svg
					className={`w-2.5 h-2.5 ms-3 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m1 1 4 4 4-4"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					id="dropdown"
					className="z-10 absolute top-full mt-1 bg-gray-800 divide-y divide-gray-700 rounded-lg shadow-lg border border-gray-700 w-full"
				>
					<ul
						className="py-2 text-sm text-gray-200"
						aria-labelledby="dropdownDefaultButton"
					>
						{options.map((option) => (
							<li key={option.value}>
								<button
									className={`block w-full text-left px-4 py-2 hover:bg-gray-700 ${
										option.value === value
											? "bg-gray-700 text-white"
											: ""
									}`}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
								>
									{option.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
