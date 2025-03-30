export interface PostNewsContentsRequest {
	team: number;
	title: string;
	contents: string; // HTML을 포함하는 문자열
	thumbnailUrl: string;
	category: 'INJURY' | 'TRANSFER' | 'MATCH' | 'OTHER';
}
