import { SuccessResponse } from '@/services/config/dto';
import { CommonCreatePostRequest, CommonPostDetailDto, CommonPostListDto } from '../common/types';
import { categories } from '@/lib/constants/options';

// Enum
export type Category = (typeof categories)[number]['value'];

// Common
export interface NewsListDto extends CommonPostListDto {
	content: string;
	thumbnailUrl: string;
	category: Category;
}
export interface NewsDetailDto extends CommonPostDetailDto {
	thumbnailUrl: string;
	category: Category;
}

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
export type GetNewsListResponse = SuccessResponse<NewsListDto[]>;

// 뉴스 상세 조회
export type GetNewsDetailResponse = SuccessResponse<NewsDetailDto>;

// 뉴스 생성
export interface CreateNewsRequest extends CommonCreatePostRequest {
	thumbnailUrl: string;
	category: Category;
}
export type CreateNewsResponse = SuccessResponse<NewsDetailDto>;

// 뉴스 수정
export interface PatchNewsDetailRequest {
	news: number;
	reason: string;
}

// 함께 볼 만한 뉴스 조회
export interface GetRecommendedNewsRequest {
	type?: 'all';
}
export type GetRecommendedNewsResponse = SuccessResponse<NewsListDto[]>;

// top5 뉴스 조회
export interface HotNewsDetailDto {
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
export type GetHotNewsResponse = SuccessResponse<HotNewsDetailDto[]>;
