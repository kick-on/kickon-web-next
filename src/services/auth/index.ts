import type { UpdatePrivacyRequest, UpdateUserInfoRequest } from './dto';
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
