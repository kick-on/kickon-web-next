export const categories = [
	{ label: '부상', value: 'INJURY' },
	{ label: '이적', value: 'TRANSFER' },
	{ label: '감독 교체', value: 'HEADCOACH' },
	{ label: '재계약', value: 'RENEWAL' },
	{ label: '불화설', value: 'UNHAPPY' },
	{ label: '은퇴', value: 'RETIRE' },
	{ label: '인터뷰', value: 'INTERVIEW' },
	{ label: '현지 팬 반응', value: 'LOCAL' },
	{ label: '기타', value: 'ETC' },
];

export const headingOptions = [
	{ label: '제목1', value: '1' },
	{ label: '제목2', value: '2' },
	{ label: '제목3', value: '3' },
	{ label: '본문', value: 'paragraph' },
];

export const reportOptions = [
	'허위사실이에요.',
	'비방 및 욕설 표현을 사용했어요.',
	'선정성 게시글이에요.',
	'스팸 홍보/도배글이에요.',
	'개인정보가 노출되었어요.',
	'저작권 및 법적인 문제예요.',
	'기타',
];

export const halftimeSortOptions = [
	{ label: '최신순', value: 'CREATED_DESC' },
	{ label: '인기순', value: 'POPULAR' },
	{ label: '등록순', value: 'CREATED_ASC' },
] as const;
