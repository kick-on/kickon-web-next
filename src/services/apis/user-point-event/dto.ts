import { SuccessResponse } from '@/services/config/dto';

export type GetUserPointRankingResponse = SuccessResponse<UserPointRankingDto>;

export interface UserPointRankingDto {
	userId: string;
	totalPoints: number;
	ranking: number;
}
