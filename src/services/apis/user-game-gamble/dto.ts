import { SuccessResponse } from '@/services/config/dto';

// 리그 기반으로 매치 리스트 조회
export interface GetGamesRequest {
	league: number;
	status: 'proceeding' | 'finished';
}

// 승부예측 생성
export interface PostGameGambleRequest {
	game: number;
	predictedHomeScore: number;
	predictedAwayScore: number;
}

// 승부예측 수정
export interface PatchGameGambleRequest {
	gamble: string;
	predictedHomeScore: number;
	predictedAwayScore: number;
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
	myGambleResult: MyGambleResultDto | null;
	pk: number;
	homeScore: number | null;
	awayScore: number | null;
	round: string;
	homePenaltyScore: number | null;
	awayPenaltyScore: number | null;
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
