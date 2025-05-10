import Image from 'next/image';
import Link from 'next/link';

export default function EmptyState({ isNews }: { isNews: boolean }) {
	return (
		<div className="flex flex-col mt-[9.9375rem] items-center">
			<Image width={120} height={74} src={'/goal-post.svg'} alt={'골대 이미지'} />
			<span className="mt-[2.375rem] mb-4 body2-semibold">아직 작성된 게시글이 없어요.</span>
			<span className="mb-9 body5-regular">{isNews ? '뉴스' : '클럽 커뮤니티'} 게시글의 첫 키커가 되어주세요!</span>
			<Link
				className="flex gap-1.5 body7-regular text-black-700 mb-[30.625rem]"
				href={`/post/${isNews ? 'news' : 'board'}`}
			>
				작성하러 가기 <Image width={16} height={16} src={'/chevron/right-gray.svg'} alt="바로가기" />
			</Link>
		</div>
	);
}
