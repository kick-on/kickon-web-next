import { BaseSuccessResponse } from '../dto';

// 승부예측 시즌 랭킹
export type GetGambleSeasonRankingResponse = BaseSuccessResponse<GambleRankingDto[]>;

// 실제 시즌 랭킹
export type GetActualSeasonRankingResponse = BaseSuccessResponse<ActualRankingDto[]>;

export interface GambleRankingDto {
	rankOrder: number;
	teamLogoUrl: string;
	teamName: string;
	gameNum: number;
	points: number;
}

export interface ActualRankingDto {
	rankOrder: number;
	teamLogoUrl: string;
	teamName: string;
	gameNum: number;
	points: number;
	wonScores: number;
}
