import { UserDto } from '@/services/auth/dto';
import { SuccessResponse } from '../../config/dto';
import { TeamDto } from '../team/dto';

// 뉴스 리스트 조회
export interface GetNewsListRequest {
	team?: number;
	size: number;
	page: number;
	order: string;
	league?: number;
}

export type GetNewsListResponse = SuccessResponse<NewsItemDto[]>;

// 함께 볼 만한 뉴스 조회
export interface GetRecommendedNewsRequest {
	type?: 'all';
}

export type GetRecommendedNewsResponse = SuccessResponse<RecommendedNewsDto[]>;

// top5 뉴스 조회
export type GetHotNewsResponse = SuccessResponse<HotNewsDto[]>;

// 내부 DTO
export interface NewsItemDto {
	pk: number;
	title: string;
	content: string;
	thumbnailUrl: string;
	category: string;
	user: UserDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
	team: TeamDto | null;
}

export interface RecommendedNewsDto {
	pk: number;
	title: string;
	content: string;
	thumbnailUrl: string;
	category: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
}

export interface HotNewsDto {
	pk: number;
	title: string;
	leagueNameKr: string;
	teamPk: number;
	teamNameKr: string;
	teamNameEn: string;
	teamLogoUrl: string;
	thumbnailUrl: string;
	category: string;
	views: number;
}
