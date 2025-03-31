import { SuccessResponse } from '../config/dto';

export interface UpdatePrivacyRequest {
	privacyAgreedAt: string;
	marketingAgreedAt?: string;
}

export interface UpdateUserInfoRequest {
	nickname: string;
	team?: number;
	league?: number;
}

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
