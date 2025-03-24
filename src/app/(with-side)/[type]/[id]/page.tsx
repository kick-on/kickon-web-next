'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockComments, mockDataMap } from '@/lib/mock';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import { allNews } from '@/components/common/category-tab/category-tab';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

const DetailPage = () => {
	const params = useParams();
	const type = params?.type as string;
	const id = params?.id;

	const [data, setData] = useState(null);
	const [likedComments, setLikedComments] = useState({});
	const [replyingTo, setReplyingTo] = useState([]);
	const [replyVisible, setReplyVisible] = useState({});

	useEffect(() => {
		if (!type || !id) return;
		const mock = mockDataMap[type];
		setData(mock);
	}, [type, id]);

	if (!data) return <p>Loading...</p>;

	const toggleCommentLike = (commentId) => {
		setLikedComments((prev) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	const toggleReplyInputVisibility = (commentId) => {
		setReplyingTo((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]));
	};

	const toggleReplyListVisibility = (commentId) => {
		setReplyVisible((prev) => ({
			...prev,
			[commentId]: !prev[commentId],
		}));
	};

	const { allowComments, imagePosition } = config[type] || {};
	const isOurTeamNews = data.isOurTeamNews ?? false;

	const commentItemProps = {
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply: toggleReplyInputVisibility,
		toggleReplyVisibility: toggleReplyListVisibility,
		replyingTo,
		replyVisible,
		isOurTeamNews,
	};

	return (
		<div className="flex flex-col gap-4">
			<ComponentFrame isMain={true}>
				<DetailContent data={data} imagePosition={imagePosition} type={type} isOurTeamNews={isOurTeamNews} />
				<CommentSection
					allowComments={allowComments}
					isOurTeamNews={isOurTeamNews}
					comments={mockComments}
					commentItemProps={commentItemProps}
				/>
			</ComponentFrame>

			<RecommendedContent mode="뉴스" data={allNews} teamName={data.teamName} />
		</div>
	);
};

export default DetailPage;
