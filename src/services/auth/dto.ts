import { LeagueDto } from '../apis/league/dto';
import { TeamDto } from '../apis/team/dto';
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

// 토큰 재발급
export interface PostNewTokenRequest {
	refreshToken: string;
}

export type PostNewTokenResponse = SuccessResponse<NewTokenDto>;

// 내부 DTO
export interface UserInfoDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
	email: string;
	providerType: string;
	privacyAgreedAt: string;
	marketingAgreedAt: string;
	favoriteTeam?: TeamDto;
	league?: LeagueDto;
}

export interface NewTokenDto {
	refreshToken: string;
	accessToken: string;
}

// 외부에서 사용하는 유저 관련 DTO
export interface UserDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
}
