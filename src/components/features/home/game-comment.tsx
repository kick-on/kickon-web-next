'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import GameCommentItem from '@/components/features/home/game-comment-item';
import {
	useCreateGameCommentMutation,
	useGameCommentListInfiniteQuery,
	useTopGameCommentQuery,
} from '@/lib/hooks/queries/useGameReplyQuery';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function GameComment({ pk }: { pk: number }) {
	const [content, setContent] = useState('');
	const scrollRef = useRef<HTMLDivElement>(null);

	const { currentUserInfo } = useCurrentUserInfoStore();
	const isLoggedIn = !!currentUserInfo;

	const { data: commentListData } = useGameCommentListInfiniteQuery({
		game: pk,
		size: 20,
		page: 1,
	});
	const { data: topCommentData } = useTopGameCommentQuery(pk);
	const createCommentMutation = useCreateGameCommentMutation(pk);

	const comments = useMemo(() => commentListData?.pages.flatMap((page) => page.data) ?? [], [commentListData]);
	const topComment = useMemo(() => topCommentData?.data, [topCommentData]);

	const handleCreateComment = () => {
		if (!content.trim()) return;
		createCommentMutation.mutate(
			{ game: pk, contents: content },
			{
				onSuccess: () => setContent(''),
			},
		);
	};

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [comments]);

	return (
		<div className="flex flex-col gap-3 text-caption-01 mx-4">
			<div className="space-y-2">
				<div ref={scrollRef} className="flex flex-col gap-1.5 min-h-0 max-h-32 game-comment-scrollbar -mr-3 pr-1">
					{comments.length === 0 ? (
						<div className="text-center py-5">지금 경기에 대한 이야기를 시작해 보세요!</div>
					) : (
						comments.map((comment) => <GameCommentItem key={comment.pk} {...comment} gamePk={pk} />)
					)}
				</div>

				{topComment && <GameCommentItem isBest {...topComment} gamePk={pk} />}
			</div>

			<div className="bg-black-200 rounded-full grid grid-cols-[1fr_auto]">
				<input
					type="text"
					className="px-4 py-1.5 outline-0 bg-transparent"
					disabled={!isLoggedIn}
					placeholder={isLoggedIn ? '댓글을 입력하세요...' : '로그인하고 대화에 참여하세요.'}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
							handleCreateComment();
						}
					}}
				/>
				{isLoggedIn && (
					<button
						className="px-3 text-black-700 disabled:opacity-50"
						onClick={handleCreateComment}
						disabled={createCommentMutation.isPending}
					>
						등록
					</button>
				)}
			</div>
		</div>
	);
}
