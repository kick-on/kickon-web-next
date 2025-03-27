export interface UpdatePrivacyRequest {
	privacyAgreedAt: string;
	marketingAgreedAt?: string;
}

export interface UpdateUserInfoRequest {
	nickname: string;
	team: number;
	league: number;
}
