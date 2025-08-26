'use client';

import ComponentFrame from '@/components/common/component-frame';
import PreviewWithTitle from '@/components/features/halftime/preview-with-title';
import Sorter from '@/components/features/halftime/sorter';
import { halftimeSortOptions } from '@/lib/constants/options';
import { useFetchSize } from '@/lib/hooks/useFetchSize';
import { useObserver } from '@/lib/hooks/useObserver';
import { useHalftimeListQuery } from '@/lib/hooks/queries/useHalftimeQuery';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useHalftimeQueryKeyStore } from '@/lib/store/useHalftimeStore';

export default function Page() {
	const searchParams = useSearchParams();
	const sort = searchParams.get('sort') ?? halftimeSortOptions[0].value;
	const size = useFetchSize();

	const { setKey } = useHalftimeQueryKeyStore();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHalftimeListQuery(sort, size);
	const halftimes = data?.pages?.flatMap((page) => page.data) ?? [];

	const getHalftimes = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	useEffect(() => {
		setKey(['halftimeList', sort, size]);
	}, [sort, size, setKey]);

	// 무한 스크롤 커스텀 훅
	const ref = useObserver(() => getHalftimes());

	return (
		<div className="pt-4 @mobile:pt-0">
			<ComponentFrame
				className="@mobile:w-full! max-[1440px]:w-[80%]! w-[90%]! max-w-[1360px]
					mx-auto @mobile:bg-transparent @mobile:border-0
					px-[7.125rem] max-[1440px]:px-4 space-y-6 py-6"
			>
				<Suspense>
					<Sorter />
				</Suspense>

				<div
					className="grid grid-cols-5 gap-6
						max-[1440px]:grid-cols-4 max-[1440px]:gap-x-3
						max-[1094px]:grid-cols-3 max-[1094px]:gap-x-3
						@mobile:grid-cols-2 @mobile:gap-4"
				>
					{halftimes.map((halftime, i) => (
						<PreviewWithTitle ref={i === halftimes.length - 1 ? ref : null} key={halftime.pk} {...halftime} />
					))}
				</div>
			</ComponentFrame>
		</div>
	);
}
