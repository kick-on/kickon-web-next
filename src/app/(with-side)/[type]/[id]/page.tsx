'use client';

import { useEffect, useState } from 'react';
import ComponentFrame from '@/components/common/componentFrame';
import CommentInput from '@/components/features/detail/CommentInput';
import { mockComments, mockDataMap } from '@/lib/mock';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import CommentItem from '@/components/features/detail/CommentItem';

// 페이지 설정
const config = {
	news: { showLogo: true, allowComments: true, imagePosition: 'top' },
	'news-other': { showLogo: true, allowComments: false, imagePosition: 'top' },
	board: { showLogo: false, allowComments: true, imagePosition: 'bottom' },
};

const DetailPage = () => {
	const params = useParams();
	const type = params?.type;
	const id = params?.id;

	const [data, setData] = useState(null);
	const [likedComments, setLikedComments] = useState({});
	const [replyingTo, setReplyingTo] = useState<number[]>([]); // 여러 개의 답글창을 관리하는 배열
	const [replyVisible, setReplyVisible] = useState<{ [key: number]: boolean }>({});

	const toggleReplyVisibility = (commentId: number) => {
		setReplyVisible((prev) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	useEffect(() => {
		if (!type || !id) return;
		const mock = mockDataMap[type as string];
		setData(mock);
	}, [type, id]);

	if (!data) return <p>Loading...</p>;

	const handleLikeToggle = (commentId: number) => {
		setLikedComments((prev) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	const handleReply = (commentId: number) => {
		setReplyingTo((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]));
	};

	const { allowComments, imagePosition } = config[type as keyof typeof config] || {};
	const isOurTeamNews = data.isOurTeamNews ?? false;
	const isBoard = type === 'board';
	const titleMargin = isBoard ? 'mt-7.5' : 'mt-0';
	const isTopImage = imagePosition === 'top';

	return (
		<ComponentFrame isMain={true}>
			<div className="px-4">
				{/* 상단 이미지 */}
				{isTopImage && (
					<Image
						src={data.thumbnailUrl}
						alt="대표 이미지"
						width={636}
						height={322}
						className="mt-6 mb-12 rounded-[10px]"
					/>
				)}

				{/* 뉴스일 경우 카테고리 & 팀 로고 */}
				{!isBoard && (
					<div className="flex gap-2 mb-2.5 items-center">
						{isOurTeamNews && <Image src="/team-logo/man-city.svg" alt="팀 로고" width={24} height={24} />}
						<span className="px-2.5 py-1 bg-black-900 text-black-000 caption1-medium rounded-[20px]">
							{data.category}
						</span>
					</div>
				)}

				{/* 제목 */}
				<h1 className={`title1-bold ${titleMargin}`}>{data.title}</h1>

				{/* 작성자 정보 및 조회수 */}
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
					</div>
				</div>

				<hr className="mt-6 mb-7.5 text-black-300" />

				{/* 하단 이미지 */}
				{!isTopImage && (
					<Image src={data.image} alt="대표 이미지" width={636} height={322} className="mb-6 rounded-[10px]" />
				)}

				{/* 본문 */}
				<p className="mb-40 whitespace-pre-line">{data.content}</p>

				{/* 킥 버튼 */}
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

				{/* 댓글 입력 */}
				{allowComments ? (
					<CommentInput />
				) : (
					<p className="text-gray-500 text-center mt-4">이 게시물에는 댓글을 작성할 수 없습니다.</p>
				)}

				{/* 댓글 개수 */}
				<p className="body5-regular text-black-600 border border-black-300 px-4 py-3">
					댓글 <span className="text-black-900">{mockComments.length}</span>개
				</p>

				<div className="flex flex-col max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black-500 scrollbar-track-transparent">
					{mockComments.map((comment) => (
						<div key={comment.pk}>
							<CommentItem
								comment={comment}
								likedComments={likedComments}
								handleLikeToggle={handleLikeToggle}
								handleReply={handleReply}
								toggleReplyVisibility={toggleReplyVisibility}
								replyingTo={replyingTo}
							/>

							{replyVisible[comment.pk] &&
								comment.replies.map((reply) => (
									<CommentItem
										key={reply.pk}
										comment={reply}
										likedComments={likedComments}
										handleLikeToggle={handleLikeToggle}
										handleReply={handleReply}
										toggleReplyVisibility={toggleReplyVisibility}
										replyingTo={replyingTo}
										isReply={true}
									/>
								))}
						</div>
					))}
				</div>
			</div>
		</ComponentFrame>
	);
};

export default DetailPage;
