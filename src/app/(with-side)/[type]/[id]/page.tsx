'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockComments, mockDataMap } from '@/lib/mock';
import { mockNewsList } from '@/lib/mock';
import ComponentFrame from '@/components/common/componentFrame';
import RecommendedContent from '@/components/common/recommendedContent';
import DetailContent from '@/components/features/detail/content/DetailContent';
import CommentSection from '@/components/features/detail/comment/CommentSection';

const config = {
	news: { allowComments: true, imagePosition: 'top' },
	board: { allowComments: true, imagePosition: 'bottom' },
};

const DetailPage = () => {
	const params = useParams();
	const router = useRouter();
	const type = params?.type as string;
	const id = params?.id;

	const [data, setData] = useState(null);
	const [likedComments, setLikedComments] = useState({});
	const [replyingTo, setReplyingTo] = useState([]);
	const [replyVisibilities, setReplyVisibilities] = useState({});

	useEffect(() => {
		if (!type || !id) return;
		if (!config[type]) {
			router.push('/404');
			return;
		}
		const mock = mockDataMap[type];
		setData(mock);
	}, [type, id, router]);

	if (!data) return <p>Loading...</p>;

	const toggleCommentLike = (commentId) => {
		setLikedComments({
			...likedComments,
			[commentId]: !likedComments[commentId],
		});
	};

	const toggleReplyInputVisibility = (commentId) => {
		setReplyingTo(
			replyingTo.includes(commentId) ? replyingTo.filter((id) => id !== commentId) : [...replyingTo, commentId],
		);
	};

	const toggleReplyListVisibility = (commentId) => {
		setReplyVisibilities({
			...replyVisibilities,
			[commentId]: !replyVisibilities[commentId],
		});
	};

	const { allowComments, imagePosition } = config[type] || {};
	const isOurTeamNews = data.isOurTeamNews ?? false;

	const commentItemProps = {
		likedComments,
		handleLikeToggle: toggleCommentLike,
		handleReply: toggleReplyInputVisibility,
		toggleReplyVisibility: toggleReplyListVisibility,
		replyingTo,
		replyVisibilities,
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

			<RecommendedContent mode="뉴스" data={mockNewsList} teamName={data.teamName} />
		</div>
	);
};

export default DetailPage;
