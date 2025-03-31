import { SuccessResponse } from '@/services/config/dto';
import { UserDto } from '../news/dto';
import { TeamDto } from '../team/dto';

export type GetRecommendedBoardsResponse = SuccessResponse<RecommendedBoardDto[]>;

export interface RecommendedBoardDto {
	pk: number;
	title: string;
	user: UserDto;
	team: TeamDto;
	createdAt: string;
	views: number;
	likes: number;
	replies: number;
}
