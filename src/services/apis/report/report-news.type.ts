import { CommonReportDetailDto } from '../common/types';

// 신고하기 요청
export interface PostReportNewsRequest extends CommonReportDetailDto {
	news: number;
}
