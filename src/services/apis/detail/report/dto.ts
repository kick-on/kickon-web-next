// 신고하기 요청
export interface PostReportDetailRequest {
	news?: number;
	board?: number;
	reason: string;
}
