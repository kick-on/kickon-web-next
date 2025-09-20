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
import Image from 'next/image';
import Link from 'next/link';

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
				{halftimes.length ? (
					<>
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
					</>
				) : (
					<div className="flex flex-col mt-[9.9375rem] items-center">
						<Image width={120} height={74} src={'/goal-post.svg'} alt="" />
						<span className="mt-[2.375rem] mb-4 body2-semibold">아직 등록된 하프타임이 없어요.</span>
						<span className="mb-9 body5-regular">하프타임의 첫 영상을 남겨주세요!</span>
						<Link className="flex gap-1.5 body7-regular text-black-700 mb-[30.625rem]" href={'/post/board'}>
							동영상 업로드하러 가기 <Image width={16} height={16} src={'/chevron/right-gray.svg'} alt="" />
						</Link>
					</div>
				)}
			</ComponentFrame>
		</div>
	);
}
