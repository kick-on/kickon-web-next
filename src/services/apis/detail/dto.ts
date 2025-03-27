import { BaseSuccessResponse } from '../dto';

export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}

export interface DetailDto {
	pk: number;
	title: string;
	content: string;
	user: UserDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
	isKicked: boolean;
	thumbnailUrl?: string;
	category?: string;
}

export interface MetaDto {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

// 뉴스 상세 조회 응답 타입
export type GetDetailResponse = BaseSuccessResponse<DetailDto> & { meta: MetaDto };
