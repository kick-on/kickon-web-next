import { BaseSuccessResponse } from '../dto';

// 뉴스 리스트 조회
export interface GetNewsListRequest {
	team?: number;
	size: number;
	page: number;
	order: string;
	league?: number;
}

export type GetNewsListResponse = BaseSuccessResponse<NewsItemDto[]>;

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
}

export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}
