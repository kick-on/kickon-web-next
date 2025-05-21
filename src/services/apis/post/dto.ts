// 게시글 생성 요청
export interface PostNewsContentsRequest {
	team: number;
	title: string;
	contents: string;
	thumbnailUrl?: string;
	category?: string;
	hasImage?: boolean;
	usedImageKeys?: string[];
}
