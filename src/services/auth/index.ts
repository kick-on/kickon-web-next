import type { UpdatePrivacyRequest } from './dto';
import { EmptySuccessResponse, FailResponse } from '../config/dto';
import axiosInstance from '../config/axiosInstance';

// 개인정보 동의 업데이트
export const updatePrivacy = async (body: UpdatePrivacyRequest) => {
	try {
		const response = await axiosInstance.patch<EmptySuccessResponse | FailResponse>('/api/user/privacy', body);

		if (response.code !== 'SUCCESS') {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error(error);
	}
};
