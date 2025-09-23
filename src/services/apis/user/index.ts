import type { GetUserInfoResponse, UpdatePrivacyRequest, UpdateUserInfoRequest } from './dto';
import type { EmptySuccessResponse, FailResponse } from '../../config/dto';
import { fetcher } from '@/lib/server/fetcher';

// 개인정보 동의 업데이트
export const updatePrivacy = async (body: UpdatePrivacyRequest) => {
	const response = await fetcher<EmptySuccessResponse | FailResponse>({
		method: 'PATCH',
		url: '/api/user/privacy',
		body,
	});

	if (!response.code.split('_').includes('SUCCESS')) {
		console.error(response);
		return response.message;
	}
	return response;
};

// 유저 정보 수정
export const updateUserInfo = async (body: UpdateUserInfoRequest) => {
	try {
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'PATCH',
			url: '/api/user',
			body,
		});

		if (response.code === 'DUPLICATED_NICKNAME') {
			return response.code;
		} else if (!response.code.split('_').includes('SUCCESS')) {
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
		const response = await fetcher<GetUserInfoResponse | FailResponse>({ method: 'GET', url: '/api/user/me' });

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('유저 정보 조회 실패: ', error);
	}
};

// 회원 탈퇴
export const deleteUserMe = async (body: { reason: string }) => {
	try {
		// delete에서는 두 번째 인자로 body가 아닌 config 객체를 받기 때문에 data에 body를 넣어줘야 함
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'DELETE',
			url: '/api/user/me',
			body,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('회원 탈퇴 실패: ', error);
	}
};
