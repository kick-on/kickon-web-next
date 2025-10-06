import { LeagueDto } from '../league/dto';
import { TeamDto } from '../team/team.type';
import { SuccessResponse } from '../../config/dto';

// 개인정보 동의
export interface UpdatePrivacyRequest {
	privacyAgreedAt: string;
	marketingAgreedAt?: string;
}

// 유저 정보 수정
export interface UpdateUserInfoRequest {
	profileImageUrl?: string;
	nickname: string;
	teams?: number[];
	league?: number;
}

// 유저 정보 조회
export type GetUserInfoResponse = SuccessResponse<UserInfoDto>;

// 내부 DTO
export interface UserInfoDto {
	id: string;
	nickname: string;
	profileImageUrl: string;
	email: string;
	providerType: string;
	privacyAgreedAt: string;
	marketingAgreedAt: string;
	favoriteTeams: TeamDto[];
	league?: LeagueDto;
	isInfluencer?: boolean;
	canChangeTeam: boolean;
	nextAvailableChangeDate: string;
	isReporter: boolean;
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
	isReporter: boolean;
}
