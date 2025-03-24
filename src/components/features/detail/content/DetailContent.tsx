import Image from 'next/image';
import MoreActionsButton from '@/components/features/detail/content/MoreActionsButton';

const DetailContent = ({ data, type, isOurTeamNews, imagePosition }) => {
	const isBoard = type === 'board';
	const isTopImage = imagePosition === 'top';
	const titleMargin = isBoard ? 'mt-7.5' : 'mt-0';

	return (
		<div className="px-4">
			{imagePosition === 'top' && (
				<Image
					src={data.thumbnailUrl}
					alt="대표 이미지"
					width={636}
					height={322}
					className="mt-6 mb-12 rounded-[10px]"
				/>
			)}
			{/* 헤더 */}
			{!isBoard && (
				<div className="flex gap-2 mb-2.5 items-center">
					{isOurTeamNews && <Image src="/team-logo/liverpool.svg" alt="팀 로고" width={24} height={24} />}
					<span className="px-2.5 py-1 bg-black-900 text-black-000 caption1-medium rounded-[20px]">
						{data.category}
					</span>
				</div>
			)}

			<h1 className={`title1-bold ${titleMargin}`}>{data.title}</h1>

			{/* 작성자 & 액션 카운터 */}
			<div className="flex justify-between items-center mt-6 text-[#8C8C8C] body6-regular">
				<div className="flex items-center gap-2">
					<Image src="/default-profile.svg" alt="작성자 프로필" width={24} height={24} className="rounded-full" />
					<span className="flex items-center gap-1.5 text-black-900">
						{data.user.nickname}
						<Image width={12} height={12} src="/certification-mark.svg" alt="인증" />
					</span>
					<span className="ml-2">{data.createdAt}</span>
					<span className="mx-2">|</span>
					<span>읽음 {data.views}</span>
				</div>

				<div className="flex gap-2 items-center text-black-600 body5-regular">
					<div className="flex items-center gap-1.5">
						<Image src="/kick/gray.svg" alt="좋아요" width={18} height={18} />
						<span>{data.likes}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Image src="/comment.svg" alt="댓글" width={18} height={18} />
						<span>{data.replies}</span>
					</div>
					<MoreActionsButton />
				</div>
			</div>

			{/* 본문 */}
			<hr className="mt-6 mb-7.5 -mx-4 text-black-300" />

			{!isTopImage && (
				<Image src={data.image} alt="대표 이미지" width={636} height={322} className="mb-6 rounded-[10px]" />
			)}

			<p className="mb-40 whitespace-pre-line">{data.content}</p>

			<button
				className="group flex mx-auto gap-2 w-fit h-9.5 items-center px-3 mb-12 
          rounded-lg shadow-[0px_2px_10px_0px_#DCDCDC] bg-black-100 text-black-900 transition
          hover:shadow-[0px_2px_10px_0px_rgba(217,25,32,0.2)]
          active:!bg-[#D91920] active:!text-white"
			>
				<Image src="/kick/black.svg" alt="축구공" width={18} height={18} />
				<span className="mr-0.5">킥</span>
				<span className="group-hover:text-[#D91920] group-active:!text-white">{data.likes}</span>
			</button>
		</div>
	);
};

export default DetailContent;
