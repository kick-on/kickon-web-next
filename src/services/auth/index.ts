import type {
	PostNewTokenRequest,
	PostNewTokenResponse,
	GetUserInfoResponse,
	UpdatePrivacyRequest,
	UpdateUserInfoRequest,
} from './dto';
import type { EmptySuccessResponse, FailResponse } from '../config/dto';
import axiosInstance from '../config/axiosInstance';

// 개인정보 동의 업데이트
export const updatePrivacy = async (body: UpdatePrivacyRequest) => {
	try {
		const response = await axiosInstance.patch<EmptySuccessResponse | FailResponse>('/api/user/privacy', body);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('개인정보 동의 실패: ', error);
	}
};

// 유저 정보 수정
export const updateUserInfo = async (body: UpdateUserInfoRequest) => {
	try {
		const response = await axiosInstance.patch<EmptySuccessResponse | FailResponse>('/api/user', body);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('유저 정보 수정 실패: ', error);
	}
};

// 유저 정보 조회
export const getUserInfo = async () => {
	try {
		const response = await axiosInstance.get<GetUserInfoResponse | FailResponse>('/api/user/me');

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('유저 정보 조회 실패: ', error);
	}
};

// 토큰 재발급
export const postNewToken = async (body: PostNewTokenRequest) => {
	try {
		const response = await axiosInstance.post<PostNewTokenResponse | FailResponse>('/auth/refresh', body);

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response.data;
	} catch (error) {
		console.error('토큰 발급 실패: ', error);
	}
};
