import { getUserInfo } from '@/services/apis/user';
import { UserInfoDto } from '@/services/apis/user/dto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentUserInfoStoreDto {
	_hasHydrated: boolean;
	currentUserInfo: UserInfoDto;
	setCurrentUserInfo: (userInfo: UserInfoDto) => void;
	clearCurrentUserInfo: () => void;
	fetchUserInfo: () => Promise<void>; // 새로 추가된 비동기 함수
}

export const useCurrentUserInfoStore = create(
	persist<CurrentUserInfoStoreDto>(
		(set) => ({
			_hasHydrated: false,
			currentUserInfo: null,
			setCurrentUserInfo: (userInfo) => set({ currentUserInfo: userInfo }),
			clearCurrentUserInfo: () => set({ currentUserInfo: null }),
			fetchUserInfo: async () => {
				const userInfo = await getUserInfo();
				set({ currentUserInfo: userInfo.data, _hasHydrated: true });
			},
		}),
		{
			name: 'KICKON_CURRENT_USER_INFO', // 로컬 스토리지에 저장될 키 이름
			onRehydrateStorage: () => (state) => {
				if (state) {
					state._hasHydrated = true;
				}
			},
		},
	),
);
