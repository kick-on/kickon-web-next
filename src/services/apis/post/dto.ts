// 게시글 생성 요청
export interface PostNewsContentsRequest {
	team: number;
	title: string;
	contents: string;
	thumbnailUrl?: string;
	category?: 'INJURY' | 'TRANSFER' | 'MATCH' | 'OTHER';
}
// TODO: 카테고리 종류 정리
