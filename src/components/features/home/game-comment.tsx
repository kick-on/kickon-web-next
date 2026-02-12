import { GameCommentDto } from '@/services/apis/game/game-reply.type';
import GameCommentItem from '@/components/features/home/game-comment-item';

export default function GameComment({ pk }: { pk: number }) {
	const comments: GameCommentDto[] = [
		{
			pk: 1,
			contents:
				'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
			user: {
				id: '9ba08d10-8d66-4b66-937c-8233ef7e3036',
				nickname: '가으님',
				profileImageUrl: '',
				isReporter: false,
			},
			createdAt: '2026-02-03T17:16:13.490055',
			kickCount: 1,
			kicked: true,
		},
		{
			pk: 1,
			contents: '댓글 입니다~~',
			user: {
				id: '9ba08d10-8d66-4b66-937c-8233ef7e3036',
				nickname: '가으님',
				profileImageUrl: '',
				isReporter: false,
			},
			createdAt: '2026-02-03T17:16:13.490055',
			kickCount: 1,
			kicked: true,
		},
		{
			pk: 1,
			contents:
				'댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~댓글 입니다~~',
			user: {
				id: '9ba08d10-8d66-4b66-937c-8233ef7e3036',
				nickname: '가으님',
				profileImageUrl: '',
				isReporter: false,
			},
			createdAt: '2026-02-03T17:16:13.490055',
			kickCount: 1,
			kicked: true,
		},
		{
			pk: 1,
			contents: '댓글 입니다~~',
			user: {
				id: '9ba08d10-8d66-4b66-937c-8233ef7e3036',
				nickname: '가으님',
				profileImageUrl: '',
				isReporter: false,
			},
			createdAt: '2026-02-03T17:16:13.490055',
			kickCount: 1,
			kicked: true,
		},
		{
			pk: 1,
			contents: '댓글 입니다~~',
			user: {
				id: '9ba08d10-8d66-4b66-937c-8233ef7e3036',
				nickname: '가으님',
				profileImageUrl: '',
				isReporter: false,
			},
			createdAt: '2026-02-03T17:16:13.490055',
			kickCount: 1,
			kicked: true,
		},
	];

	return (
		<div className="flex flex-col gap-3 text-caption-01 mx-4">
			<div className="space-y-2">
				<div className="flex flex-col gap-1.5 min-h-0 max-h-32 game-comment-scrollbar -mr-3 pr-1">
					{comments.map((comment) => (
						<GameCommentItem key={comment.pk} {...comment} />
					))}
				</div>

				<GameCommentItem isBest {...comments[0]} />
			</div>

			<div className="bg-black-200 rounded-full grid grid-cols-[1fr_auto]">
				<input type="text" className="px-4 py-1.5 outline-0" placeholder="댓글을 입력하세요..." />
				<button className="px-3 text-black-700">등록</button>
			</div>
		</div>
	);
}
