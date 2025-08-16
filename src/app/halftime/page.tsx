'use client';

import ComponentFrame from '@/components/common/component-frame';
import PreviewWithTitle from '@/components/features/halftime/preview-with-title';
import Sorter from '@/components/features/halftime/sorter';
import { halftimeSortOptions } from '@/lib/constants/options';
import { useFetchSize } from '@/lib/hooks/useFetchSize';
import { useAllHalftimePksStore } from '@/lib/store/useHalftimeStore';
import { getHalftimeList } from '@/services/apis/shorts/shorts.api';
import { BaseHalftimeDto, HalftimeSortType } from '@/services/apis/shorts/shorts.type';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
	const searchParams = useSearchParams();

	const [halftimes, setHalftimes] = useState<BaseHalftimeDto[]>([]);
	const { appendAllHalftimePks, clearAllHalftimePks } = useAllHalftimePksStore();

	const [page, setPage] = useState(1);
	const sort = searchParams.get('sort') ?? halftimeSortOptions[0].value;
	const size = useFetchSize();

	// sort가 변경되면 초기화
	useEffect(() => {
		setPage(1);
		getHalftimes(1, 'init');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sort]);

	// 페이지 번호가 바뀔 때 추가 데이터를 불러옵니다.
	useEffect(() => {
		if (page > 1) {
			getHalftimes(page, 'append');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const getHalftimes = async (pageNum: number, type: 'init' | 'append') => {
		try {
			const params = {
				sort: sort as HalftimeSortType,
				size,
				page: pageNum,
			};
			const response = await getHalftimeList(params);

			if (type === 'init') {
				setHalftimes(response.data);
				clearAllHalftimePks();
			} else {
				setHalftimes((prev) => [...prev, ...response.data]);
			}

			appendAllHalftimePks(response.data);
		} catch {
			alert('동영상을 불러오는 중 문제가 발생했습니다.');
		}
	};

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
					{halftimes.map((halftime) => (
						<PreviewWithTitle key={halftime.pk} {...halftime} />
					))}
				</div>
			</ComponentFrame>
		</div>
	);
}
