'use client';
import Image from 'next/image';
import MoreActionsButton from '@/components/features/detail/content/MoreActionsButton';
import { useEffect, useState } from 'react';
import { postContentLike } from '@/services/apis/detail/kick';
import DOMPurify from 'dompurify';
import { getRelativeTime } from '@/lib/utils/getRelativeTime';
import { categories } from '@/lib/constants/options';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import LoginModal from '@/components/common/login-modal/login-modal';

const DetailContent = ({ data, type, isCommentAllowed }) => {
	const isNews = type === 'news';
	const titleMargin = isNews ? 'mt-0' : 'mt-7.5';
	const [isLiked, setIsLiked] = useState(data.isKicked);
	const [likes, setLikes] = useState(data.likes);
	const [sanitizedContent, setSanitizedContent] = useState('');

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const categoryLabel = categories.find((category) => category.value === data.category)?.label || data.category;

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const sanitized = DOMPurify.sanitize(data.content, {
				ADD_TAGS: ['iframe'],
				ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
			});
			setSanitizedContent(sanitized);
		}
	}, [data.content]);

	const handleLikeButtonClick = async () => {
		// 비회원인 경우 클릭 차단 & 알림 표시
		if (!getAccessToken() || !getRefreshToken()) {
			setIsLoginModalOpen(true);
			return;
		}

		try {
			const success = await postContentLike(data.pk, isNews);
			if (success) {
				// API 응답이 성공하면 UI 업데이트
				setIsLiked((prev) => !prev);
				setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
			} else {
				alert('좋아요 요청에 실패했습니다. 다시 시도해주세요.');
			}
		} catch (error) {
			console.error('좋아요 요청 중 오류 발생:', error);
			alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div className="px-4">
			{/* 대표 이미지 */}
			{isNews && (
				<Image
					src={data.thumbnailUrl}
					alt="대표 이미지"
					width={636}
					height={322}
					className="mt-6 mb-12 rounded-[0.625rem] w-[636px] h-[322px] object-cover"
				/>
			)}

			{/* 헤더 */}
			{isNews && (
				<div className="flex gap-2 mb-2.5 items-center">
					{!isCommentAllowed && <Image src={data.team.logoUrl} alt="팀 로고" width={24} height={24} />}
					<span className="px-2.5 py-1 bg-black-900 text-black-000 caption1-medium rounded-[1.25rem]">
						{categoryLabel}
					</span>
				</div>
			)}

			<h1 className={`title1-bold ${titleMargin}`}>{data.title}</h1>

			{/* 작성자 & 액션 카운터 */}
			<div className="flex justify-between items-center mt-6 text-[#8C8C8C] body6-regular">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 overflow-hidden">
						<Image
							src={data.user.profileImageUrl}
							alt="작성자 프로필"
							width={24}
							height={24}
							className="w-full h-full rounded-full object-cover"
						/>
					</div>
					<span className="flex items-center gap-1.5 text-black-900">
						{data.user.nickname}
						<Image width={12} height={12} src="/certification-mark.svg" alt="인증" />
					</span>
					<span className="ml-2">{getRelativeTime(data.createdAt)}</span>
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
			<div className="mb-40 body3-regular" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

			{/* 좋아요 버튼 */}
			<button
				onClick={handleLikeButtonClick}
				className={`button4-medium group flex mx-auto gap-2 w-fit h-9.5 items-center px-3 mb-12 
	rounded-lg shadow-[0rem_0.125rem_0.625rem_0rem_#DCDCDC] 
	${isLiked ? 'bg-[#D91920] text-white' : 'bg-black-100 text-black-900'} transition
	hover:shadow-[0rem_0.125rem_0.625rem_0rem_rgba(217,25,32,0.2)]`}
			>
				<Image src={'/kick/black.svg'} alt="축구공" width={18} height={18} />
				<span className="mr-0.5">킥</span>
				<span className={`${isLiked ? 'text-white' : 'group-hover:text-[#D91920]'}`}>{likes}</span>
			</button>
			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
};

export default DetailContent;
