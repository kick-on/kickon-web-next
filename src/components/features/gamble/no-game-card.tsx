'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NoGameCard({ type }: { type: 'match' | 'predict' }) {
	const isMatch = type === 'match';

	return (
		<div
			className="max-w-[41.75rem] bg-black-000 rounded-[0.625rem] flex flex-col items-center
      py-[3.3125rem] @mobile:py-[3.125rem]"
		>
			<div className="relative w-24 @mobile:w-[4.375rem] h-auto aspect-7/10 mb-8">
				<Image className="w-auto h-auto" src="/no-game.svg" alt="경기 없음 이미지" fill />
			</div>

			<span className="title3-semibold @mobile:text-16 mb-4">
				{isMatch ? '예정된 경기 일정이 없어요.' : '참여한 경기가 없어요.'}
			</span>
			<span className="title4-medium @mobile:text-14 mb-8">참여 가능한 다른 경기를 확인해 보세요.</span>

			<Link
				href="/gamble?type=match"
				className="flex gap-1.5 text-black-000 py-2.5 px-5 bg-black-900 rounded-full button4-medium"
			>
				가능한 경기 보기
				<Image
					className="brightness-0 invert"
					src={'/chevron/right-gray.svg'}
					alt="오른쪽 화살표"
					width={16}
					height={16}
				/>
			</Link>
		</div>
	);
}
