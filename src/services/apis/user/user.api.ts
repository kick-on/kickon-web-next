import type { GetUserInfoResponse, UpdatePrivacyRequest, UpdateUserInfoRequest } from './user.type';
import type { EmptySuccessResponse } from '../../config/dto';
import { fetcher } from '@/lib/server/fetcher';

// 개인정보 동의 업데이트
export const updatePrivacy = async (body: UpdatePrivacyRequest) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'PATCH',
		url: '/api/user/privacy',
		body,
	});

	return response;
};

// 유저 정보 수정
export const updateUserInfo = async (body: UpdateUserInfoRequest) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'PATCH',
		url: '/api/user',
		body,
	});

	return response;
};

// 유저 정보 조회
export const getUserInfo = async () => {
	const response = await fetcher<GetUserInfoResponse>({ method: 'GET', url: '/api/user/me' });
	return response;
};

// 회원 탈퇴
export const deleteUserMe = async (body: { reason: string }) => {
	const response = await fetcher<EmptySuccessResponse>({
		method: 'DELETE',
		url: '/api/user/me',
		body,
	});

	return response;
};
