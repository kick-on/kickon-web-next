'use client';
import Image from 'next/image';
import MoreActionsButton from '@/components/features/detail/content/MoreActionsButton';
import { useState } from 'react';
import { postContentLike } from '@/services/apis/detail/kick';
import DOMPurify from 'dompurify';

const DetailContent = ({ data, type, isOurTeamPost, imagePosition }) => {
	const isNews = type === 'news';
	const isTopImage = imagePosition === 'top';
	const titleMargin = isNews ? 'mt-0' : 'mt-7.5';

	const [likes, setLikes] = useState(data.likes);
	const [isLiked, setIsLiked] = useState(false); // 좋아요 눌렀는지 여부

	const handleLikeButtonClick = async () => {
		if (isLiked) return; // 이미 눌렀다면 실행 안 함

		console.log('좋아요 요청 데이터:', data.pk, isNews);
		const success = await postContentLike(data.pk, isNews);
		console.log('API 호출 결과:', success);

		if (success) {
			setLikes((prev) => prev + 1);
			setIsLiked(true); // 좋아요 상태 유지
		}
	};

	return (
		<div className="px-4">
			{/* 대표 이미지 */}
			{imagePosition === 'top' && (
				<Image
					src={data.thumbnailUrl}
					alt="대표 이미지"
					width={636}
					height={322}
					className="mt-6 mb-12 rounded-[0.625rem]"
				/>
			)}

			{/* 헤더 */}
			{isNews && (
				<div className="flex gap-2 mb-2.5 items-center">
					{isOurTeamPost && <Image src="/team-logo/liverpool.svg" alt="팀 로고" width={24} height={24} />}
					<span className="px-2.5 py-1 bg-black-900 text-black-000 caption1-medium rounded-[1.25rem]">
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
					<span>|</span>
					<span>읽음 {data.views}</span>
				</div>

				<div className="flex gap-3 items-center text-black-600 body5-regular">
					<div className="flex items-center gap-1.5">
						<Image src="/kick/gray.svg" alt="좋아요" width={18} height={18} />
						<span>{likes}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Image src="/comment.svg" alt="댓글" width={18} height={18} />
						<span>{data.replies}</span>
					</div>
					<MoreActionsButton type={type} pk={data.pk} />
				</div>
			</div>

			{/* 본문 */}
			<hr className="mt-6 mb-7.5 -mx-4 text-black-300" />

			{!isTopImage && (
				<Image src={data.image} alt="대표 이미지" width={636} height={322} className="mb-6 rounded-[0.625rem]" />
			)}

			<div
				className="mb-40 whitespace-pre-line body3-regular"
				dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
			/>
			{/* 좋아요 버튼 */}
			<button
				onClick={handleLikeButtonClick}
				disabled={isLiked} // 한 번 누르면 비활성화
				className={`button4-medium group flex mx-auto gap-2 w-fit h-9.5 items-center px-3 mb-12 
          rounded-lg shadow-[0rem_0.125rem_0.625rem_0rem_#DCDCDC] 
          ${isLiked ? 'bg-[#D91920] text-white' : 'bg-black-100 text-black-900'} transition
          hover:shadow-[0rem_0.125rem_0.625rem_0rem_rgba(217,25,32,0.2)]`}
			>
				<Image src={isLiked ? '/kick/red.svg' : '/kick/black.svg'} alt="축구공" width={18} height={18} />
				<span className="mr-0.5">킥</span>
				<span className={`${isLiked ? 'text-white' : 'group-hover:text-[#D91920]'}`}>{likes}</span>
			</button>
		</div>
	);
};

export default DetailContent;
