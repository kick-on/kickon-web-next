'use client';
import Image from 'next/image';
import MoreActionsButton from '@/components/features/detail/content/more-actions-button';
import { Suspense, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { getRelativeTime } from '@/lib/utils/getRelativeTime';
import { categories } from '@/lib/constants/options';
import LoginModal from '@/components/common/login-modal/login-content';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import parse, { Element } from 'html-react-parser';
import { createNewsKick } from '@/services/apis/news/news.api';
import { createBoardKick } from '@/services/apis/board/board.api';

const DetailContent = ({ data, type, isCommentAllowed }) => {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const isNews = type === 'news';
	const titleMargin = isNews ? 'mt-0' : 'mt-7.5 @mobile:mt-4';
	const [isLiked, setIsLiked] = useState(data.isKicked);
	const [likes, setLikes] = useState(data.likes);
	const [sanitizedContent, setSanitizedContent] = useState('');
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [isVerticalImage, setIsVerticalImage] = useState(false);

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const categoryLabel = categories.find((category) => category.value === data.category)?.label || data.category;

	// 이미지 정보를 미리 가져오는 함수 (클라이언트 사이드에서만 실행)
	useEffect(() => {
		if (typeof window === 'undefined' || !isNews || !data.thumbnailUrl) return;

		// 이미지를 불러오기 위한 함수
		const preloadImage = () => {
			const img = document.createElement('img');
			img.onload = () => {
				setIsVerticalImage(img.naturalHeight > img.naturalWidth);
				setIsImageLoaded(true);
			};
			img.src = data.thumbnailUrl;
		};

		preloadImage();
	}, [isNews, data.thumbnailUrl]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const sanitized = DOMPurify.sanitize(data.content, {
			ADD_TAGS: ['iframe', 'br', 'p'],
			ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'],
		});
		setSanitizedContent(sanitized);
	}, [data.content]);

	const parsedContent = parse(sanitizedContent, {
		replace: (domNode) => {
			if ('name' in domNode && domNode.name === 'img') {
				const { src, alt, width, height } = (domNode as Element).attribs;
				return (
					<Image
						src={src}
						alt={alt || '본문 이미지'}
						width={width ? parseInt(width) : 640}
						height={height ? parseInt(height) : 480}
						sizes="100vw"
						style={{ width: '100%', height: 'auto' }}
					/>
				);
			}
		},
	});

	const handleLikeButtonClick = async () => {
		// 비회원인 경우 클릭 차단 & 알림 표시
		if (!currentUserInfo) {
			setIsLoginModalOpen(true);
			return;
		}

		try {
			const success = isNews ? await createNewsKick(data.pk) : await createBoardKick(data.pk);
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

	const isMyContents = data?.user?.id === currentUserInfo?.id;

	return (
		<div className="px-4">
			{/* 대표 이미지 */}
			{isNews && isImageLoaded && (
				<div
					className={`mt-6 mb-12 @mobile:mt-4 @mobile:mb-6 rounded-[0.625rem] overflow-hidden 
					w-full max-w-[636px] aspect-[636/322]
					${isVerticalImage ? 'bg-black-200 flex justify-center items-center' : ''}
				`}
				>
					<Image
						src={data.thumbnailUrl}
						alt="대표 이미지"
						width={636}
						height={322}
						className={`
						${isVerticalImage ? 'object-contain h-full max-h-[322px]' : 'object-cover w-full h-full'}
					`}
						priority={true}
					/>
				</div>
			)}

			{/* 헤더 */}
			{isNews && (
				<div className="flex gap-2 mb-2.5 items-center">
					{!isCommentAllowed && (
						<Image className="w-6 h-6 object-contain" src={data.team.logoUrl} alt="팀 로고" width={24} height={24} />
					)}
					<span className="px-2.5 py-1 bg-black-900 text-black-000 caption1-medium rounded-[1.25rem]">
						{categoryLabel}
					</span>
				</div>
			)}

			<h1 className={`title1-bold @mobile:text-title2-semibold ${titleMargin}`}>{data.title}</h1>

			{/* 작성자 & 액션 카운터 */}
			<div className="flex justify-between items-center mt-6 text-[#8C8C8C] body6-regular @mobile:text-12 @mobile:mt-4">
				<div className="flex items-center gap-2">
					<div className="w-6 h-6 overflow-hidden">
						<Image
							src={data.user.profileImageUrl || '/default-profile.svg'}
							alt="작성자 프로필"
							width={24}
							height={24}
							className="w-full h-full rounded-full object-cover"
						/>
					</div>
					<span className="flex items-center gap-1.5 text-black-900 @mobile:text-13">
						{data.user.nickname}
						{/* <Image width={12} height={12} src="/certification-mark.svg" alt="인증" /> */}
					</span>
					<span className="ml-2">{getRelativeTime(data.createdAt)}</span>
					<span>|</span>
					<span>읽음 {data.views}</span>
				</div>

				<div className="flex gap-3 items-center text-black-600 body5-regular">
					<div className="flex items-center gap-1.5 @mobile:hidden">
						<Image src="/kick/gray.svg" alt="좋아요" width={18} height={18} />
						<span>{likes}</span>
					</div>
					<div className="flex items-center gap-1.5 @mobile:hidden">
						<Image src="/comment.svg" alt="댓글" width={18} height={18} />
						<span>{data.replies}</span>
					</div>
					<Suspense>
						<MoreActionsButton type={type} pk={data.pk} isMyContent={isMyContents} />
					</Suspense>
				</div>
			</div>

			{/* 본문 */}
			<hr className="mt-6 mb-7.5 -mx-4 text-black-300" />
			<div className="mb-40 body3-regular @mobile:mb-30 responsive-youtube tiptap">{parsedContent}</div>

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
