import { SuccessResponse } from '../../config/dto';
import { TeamDto } from '../team/dto';
import { UserDto } from './comment/dto';

export interface DetailDto {
	pk: number;
	title: string;
	content: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
	isKicked: boolean;
	thumbnailUrl?: string;
	category?: string;
	isInfluencer?: boolean; // 인플루언서의 글인지 아닌지
	isPinned?: boolean; // 인플루언서가 고정했는지 안 했는지
}

// 뉴스 상세 조회 응답 타입
export type GetDetailResponse = SuccessResponse<DetailDto>;
