import { SuccessResponse } from '@/services/config/dto';
import { TeamDto } from '../team/dto';

// 리그 기반으로 매치 리스트 조회
export interface GetGamesRequest {
	league: number;
	season: number;
	status: 'proceeding' | 'finished';
}

export type GetGamesResponse = SuccessResponse<GameTaggedLeagueDto>;

// 내부 dto
export interface GameTaggedLeagueDto {
	name: string;
	pk: number;
	games: GameDto[];
}

export interface GameDto {
	homeTeam: GambleTeamDto;
	awayTeam: GambleTeamDto;
	gambleResult: GambleResultDto;
	myGambleResult: MyGambleResultDto;
	pk: number;
	homeScore: number;
	awayScore: number;
	round: string;
	homePenaltyScore: number;
	awayPenaltyScore: number;
	gameStatus: 'PENDING' | 'PROCEEDING' | 'CANCELED' | 'HOME' | 'AWAY' | 'DRAW' | 'POSTPONED';
	startAt: string;
}

export interface GambleTeamDto {
	pk: number;
	name: string;
	logoUrl: string;
}

// 예측 현황 비율
export interface GambleResultDto {
	home: number;
	away: number;
	draw: number;
	participationNumber: number;
}

// 내 예측
export interface MyGambleResultDto {
	id: string;
	homeScore: number;
	awayScore: number;
	result: 'HOME' | 'AWAY' | 'DRAW';
	gambleStatus: 'COMPLETED' | 'SUCCEED' | 'FAILED' | 'PERFECT';
}
