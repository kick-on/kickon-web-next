export const dummyNotices = [
	{
		id: 1,
		type: 'match', // 경기 일정 알림
		date: '2025-07-25T12:00:00Z',
		content: '서울 vs 울산 경기가 D-3 남았어요.',
	},
	{
		id: 2,
		type: 'reply', // 댓글/답글 알림
		date: '2025-07-26T09:30:00Z',
		content: '회원님의 게시글에 새로운 댓글이 달렸어요.',
	},
	{
		id: 3,
		type: 'prediction', // 승부 예측 알림
		date: '2025-07-27T15:00:00Z',
		content: '서울 승부 예측을 완료했어요!',
		teamLogo: '/team-logo/seoul.svg',
	},
	{
		id: 4,
		type: 'match',
		date: '2025-07-27T10:00:00Z',
		content: '포항 vs 인천 경기가 D-1 남았어요.',
	},
	{
		id: 5,
		type: 'prediction',
		date: '2025-07-27T14:20:00Z',
		content: '울산 승부 예측을 완료했어요!',
		teamLogo: '/team-logo/seoul.svg',
	},
];
