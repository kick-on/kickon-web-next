import { BaseSuccessResponse } from '../dto';

export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}

export interface NewsDetailDto {
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
	isKicked: boolean;
}

export interface MetaDto {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

// 뉴스 상세 조회 응답 타입
export type GetNewsDetailResponse = BaseSuccessResponse<NewsDetailDto> & { meta: MetaDto };
