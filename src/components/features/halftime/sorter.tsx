'use client';

import { halftimeSortOptions } from '@/lib/constants/options';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sorter() {
	const [selectedSort, setSelectedSort] = useState<string>(halftimeSortOptions[0].value);
	const selectedIndex = halftimeSortOptions.findIndex((option) => option.value === selectedSort);
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const sort = searchParams.get('sort');

		if (halftimeSortOptions.some((option) => option.value === sort)) {
			setSelectedSort(sort);
		} else {
			setSelectedSort(halftimeSortOptions[0].value);
		}
	}, [searchParams]);

	const handleOptionClick = (value) => {
		if (value === selectedSort) return;
		router.replace(`/halftime?sort=${value}`);
	};

	return (
		<div className="relative bg-black-200 rounded-lg flex w-fit ml-auto">
			<div
				className="absolute top-0 left-0 h-full rounded-lg bg-primary-900 transition-all duration-200 ease-in-out"
				style={{
					width: `calc(100% / ${halftimeSortOptions.length})`,
					transform: `translateX(calc(${selectedIndex} * 100%))`,
				}}
			></div>
			{halftimeSortOptions.map(({ label, value }) => (
				<button
					key={value}
					onClick={() => handleOptionClick(value)}
					className={clsx(
						'relative z-5 px-4 py-1.5 rounded-lg text-button-02 transition-colors',
						selectedSort === value ? 'text-black-000 font-semibold' : 'text-black-500',
					)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
