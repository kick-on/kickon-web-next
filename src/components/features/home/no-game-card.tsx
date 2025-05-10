import Image from 'next/image';
import Link from 'next/link';

export default function NoGameCard() {
	return (
		<div
			className="max-w-[41.75rem] bg-black-000 rounded-[0.625rem] flex flex-col items-center
      py-[3.3125rem] @mobile:py-12"
		>
			<Image className="w-24 h-auto aspect-7/10" src="/no-game.svg" alt="경기 없음 이미지" width={112} height={156} />
			<span className="title4-semibold @mobile:text-16 mt-[2.375rem] mb-5">예정된 경기 일정이 없어요.</span>
			<Link href={'/board?=전체'} className="flex gap-1 text-black-700 body5-medium">
				클럽 커뮤니티 보러가기
				<Image src={'/chevron/right-gray.svg'} alt="오른쪽 화살표" width={16} height={16} />
			</Link>
		</div>
	);
}
