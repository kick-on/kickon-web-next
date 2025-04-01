'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaginationBar({ totalPages, baseUrl }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get('page') || '1');

	const pageGroupSize = 10;
	const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
	const startPage = currentGroup * pageGroupSize + 1;
	const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

	const handlePageClick = (page) => {
		if (page >= 1 && page <= totalPages) {
			// 현재 URL에서 쿼리 파라미터만 변경
			const params = new URLSearchParams(searchParams);
			params.set('page', page.toString());
			router.push(`${baseUrl}?${params.toString()}`);
		}
	};

	return (
		<div className="flex gap-3 items-center mx-auto mb-10">
			{/* 이전 그룹 버튼 */}
			<button
				onClick={() => handlePageClick(startPage - 1)}
				disabled={currentPage === 1}
				className={`px-3 py-1 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : ''}`}
			>
				이전
			</button>

			{/* 현재 그룹의 페이지 버튼들 */}
			<div className="flex gap-4.5">
				{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
					<button key={page} onClick={() => handlePageClick(page)} className="py-1 text-gray-500">
						<span
							className={`pb-1.5 border-b-2 ${currentPage === page ? 'border-black text-black' : 'border-transparent'}`}
						>
							{page}
						</span>
					</button>
				))}
			</div>

			{/* 다음 그룹 버튼 */}
			<button
				onClick={() => handlePageClick(endPage + 1)}
				disabled={endPage === totalPages}
				className="px-3 py-1 rounded-full flex items-center gap-1"
			>
				다음
			</button>
		</div>
	);
}
