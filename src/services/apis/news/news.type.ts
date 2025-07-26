import { SuccessResponse } from '@/services/config/dto';
import { CommonDetailDto } from '../common/types';
import { categories } from '@/lib/constants/options';

// Enum
export type Category = (typeof categories)[number]['value'];

// Common
export interface NewsDto extends CommonDetailDto {
	thumbnailUrl: string;
	category: Category;
}

// 뉴스 상세 조회
export type GetDetailResponse = SuccessResponse<NewsDto>;

// 뉴스 리스트 조회
export interface GetNewsListRequest {
	team?: number;
	size: number;
	page: number;
	order: string;
	league?: number;
	// 무한 스크롤
	infinite?: boolean;
	lastNews?: number;
	lastViewCount?: number;
}
export type GetNewsListResponse = SuccessResponse<NewsDto[]>;

// 함께 볼 만한 뉴스 조회
export interface GetRecommendedNewsRequest {
	type?: 'all';
}
export type GetRecommendedNewsResponse = SuccessResponse<NewsDto[]>;

// top5 뉴스 조회
export interface HotNewsDto {
	pk: number;
	title: string;
	leagueNameKr: string;
	teamPk: number;
	teamNameKr: string;
	teamNameEn: string;
	teamLogoUrl: string;
	thumbnailUrl: string;
	category: Category;
	views: number;
}
export type GetHotNewsResponse = SuccessResponse<HotNewsDto[]>;
