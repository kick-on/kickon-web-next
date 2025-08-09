'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const options = [
	{ label: '최신순', value: 'CREATED_DESC' },
	{ label: '인기순', value: 'POPULAR' },
	{ label: '등록순', value: 'CREATED_ASC' },
];

export default function Sorter() {
	const [selectedSort, setSelectedSort] = useState(options[0].value);
	const selectedIndex = options.indexOf(options.find((option) => option.value === selectedSort));
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const sort = searchParams.get('sort');

		if (options.some((option) => option.value === sort)) {
			setSelectedSort(sort);
		} else {
			setSelectedSort(options[0].value);
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
					width: `calc(100% / ${options.length})`,
					transform: `translateX(calc(${selectedIndex} * 100%))`,
				}}
			></div>
			{options.map(({ label, value }) => (
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
