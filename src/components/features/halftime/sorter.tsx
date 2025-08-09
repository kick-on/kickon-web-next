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

	return (
		<div className="bg-black-200 rounded-lg flex w-fit ml-auto">
			{options.map(({ label, value }) => (
				<button
					key={value}
					onClick={() => router.replace(`/halftime?sort=${value}`)}
					className={clsx(
						'px-4 py-1.5 rounded-lg',
						selectedSort === value ? 'text-black-000 font-semibold bg-primary-900' : 'text-black-500 bg-transparent',
					)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
