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
