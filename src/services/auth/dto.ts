import { SuccessResponse } from '../config/dto';

// 개인정보 동의
export interface UpdatePrivacyRequest {
	privacyAgreedAt: string;
	marketingAgreedAt?: string;
}

// 유저 정보 수정
export interface UpdateUserInfoRequest {
	nickname: string;
	team?: number;
	league?: number;
}

// 유저 정보 조회
export type GetUserInfoResponse = SuccessResponse<UserInfoDto>;

export interface UserInfoDto {
	id: string;
	nickname: string;
	email: string;
	profileImageUrl: string;
	providerType: string;
	teamLogoUrl?: string;
	teamName?: string;
	leagueLogoUrl?: string;
	leagueName?: string;
	privacyAgreedAt: string;
	marketingAgreedAt: string;
}

// 토큰 재발급
export interface PostNewTokenRequest {
	refreshToken: string;
}

export type PostNewTokenResponse = SuccessResponse<NewTokenDto>;

export interface NewTokenDto {
	refreshToken: string;
	accessToken: string;
}
