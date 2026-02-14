import { SuccessResponse } from '@/services/config/dto';
import { GambleResultDto, MyGambleResultDto } from '../user-game-gamble/user-game-gamble.type';
import { LeagueDto } from '../league/league.type';
import { TeamDto } from '../team/team.type';

// 매치 리스트 조회
export interface GetGamesRequest {
	league?: number; // 응원팀이 없거나 비회원인 경우에 사용
	status: 'proceeding' | 'finished';
	team?: number; // 응원팀이 있는 경우에 사용, 그때 undefined이면 전체 팀 경기
	from?: string; // YYYY-MM-DD
	to?: string; // YYYY-MM-DD
}

export type GetGamesResponse = SuccessResponse<GameTaggedLeagueDto[]>;

// 참여한 예측 리스트 조회
export interface GetMyPredictionsRequest {
	from: string; // YYYY-MM-DD
	to: string; // YYYY-MM-DD
}

export type GetMyPredictionsResponse = SuccessResponse<GameTaggedLeagueDto[]>;

// 예측 통계 조회
export type GetMyStatsResponse = SuccessResponse<MyStatsDto>;

export interface MyStatsDto {
	totalSuccessRate: number;
	totalParticipationCount: number;
	totalParticipationRate: number;
	thisMonthSuccessRate: number;
	thisMonthHitSummary: string;
	thisMonthPoints: number;
	totalPoints: number;
	mostHitTeamName: string;
	mostHitTeamColor: string;
	mostHitTeamLogoUrl: string;
}

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
