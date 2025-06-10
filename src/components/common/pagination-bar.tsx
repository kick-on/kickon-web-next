'use client';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function PaginationBar({ totalPages, baseUrl }: { totalPages: number; baseUrl: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const pathname = usePathname();
	const isDetailPage = /^\/(news|board)\/\d+/.test(pathname || '');

	const currentPage = Number(searchParams.get('page') || '1');
	const pageGroupSize = 10;
	const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
	const startPage = currentGroup * pageGroupSize + 1;
	const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

	const handlePageClick = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			const params = new URLSearchParams(searchParams.toString());
			params.set('page', page.toString());

			// 상세 페이지일 때만 scroll: false
			router.push(`${baseUrl}?${params.toString()}`, {
				scroll: !isDetailPage, // true일 경우 스크롤됨, false면 스크롤 안 됨
			});
		}
	};

	const isFirstGroup = startPage === 1;
	const isLastGroup = endPage === totalPages;

	return (
		<div className="flex gap-3 body6-regular items-center mx-auto my-10 @mobile:hidden">
			{/* 이전 그룹 버튼 */}
			<button
				onClick={() => handlePageClick(startPage - 1)}
				disabled={isFirstGroup}
				className={`group px-3 py-1 flex gap-2 rounded-full ${isFirstGroup ? 'text-black-400' : 'text-black-600'}`}
			>
				<Image
					className="group-disabled:opacity-[45%]"
					src="/chevron/pagenation-left.svg"
					alt="이전 버튼"
					width={16}
					height={16}
				/>
				이전
			</button>

			{/* 현재 그룹의 페이지 버튼들 */}
			<div className="flex gap-4.5 px-[0.2rem]">
				{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
					<button key={page} onClick={() => handlePageClick(page)} className="py-1">
						<span
							className={`px-[0.2rem] pb-1.5 border-b-2 ${
								currentPage === page ? 'border-black text-black-900' : 'border-transparent text-black-600'
							}`}
						>
							{page}
						</span>
					</button>
				))}
			</div>

			{/* 다음 그룹 버튼 */}
			<button
				onClick={() => handlePageClick(endPage + 1)}
				disabled={isLastGroup}
				className={`group px-3 py-1 rounded-full flex gap-2 items-center ${isLastGroup ? 'text-black-400' : 'text-black-600'}`}
			>
				다음
				<Image
					className="group-disabled:opacity-[45%]"
					src="/chevron/pagenation-right.svg"
					alt="다음 버튼"
					width={16}
					height={16}
				/>
			</button>
		</div>
	);
}
