import { SuccessResponse } from '@/services/config/dto';
import { TeamDto } from '../team/dto';
import { LeagueDto } from '../league/dto';

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
	league: LeagueDto;
	games: GameDto[];
}

export interface GameDto {
	league: LeagueDto;
	homeTeam: TeamDto;
	awayTeam: TeamDto;
	gambleResult: GambleResultDto;
	myGambleResult: MyGambleResultDto | null;
	pk: number;
	homeScore: number | null; // 실제 경기 결과
	awayScore: number | null; // 실제 경기 결과
	round: string;
	homePenaltyScore: number | null;
	awayPenaltyScore: number | null;
	gameStatus: 'PENDING' | 'PROCEEDING' | 'CANCELED' | 'HOME' | 'AWAY' | 'DRAW' | 'POSTPONED';
	startAt: string;
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
