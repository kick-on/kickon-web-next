import { getUserInfo } from '@/services/apis/user';
import { UserInfoDto } from '@/services/apis/user/dto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentUserInfoStoreDto {
	currentUserInfo: UserInfoDto;
	setCurrentUserInfo: (userInfo: UserInfoDto) => void;
	clearCurrentUserInfo: () => void;
	fetchUserInfo: () => Promise<void>; // 새로 추가된 비동기 함수
}

export const useCurrentUserInfoStore = create(
	persist<CurrentUserInfoStoreDto>(
		(set) => ({
			currentUserInfo: null,
			setCurrentUserInfo: (userInfo) => set({ currentUserInfo: userInfo }),
			clearCurrentUserInfo: () => set({ currentUserInfo: null }),
			fetchUserInfo: async () => {
				// api 호출해서 상태 업데이트
				try {
					const userInfo = await getUserInfo();

					if (typeof userInfo !== 'string') {
						set({ currentUserInfo: userInfo.data });
					} else {
						console.error('Failed to fetch user info:', userInfo);
					}
				} catch (error) {
					console.error('Failed to fetch user info:', error);
				}
			},
		}),
		{
			name: 'KICKON_CURRENT_USER_INFO', // 로컬 스토리지에 저장될 키 이름
		},
	),
);
