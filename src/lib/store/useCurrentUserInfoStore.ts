import { UserInfoDto } from '@/services/apis/user/dto';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentUserInfoStoreDto {
	currentUserInfo: UserInfoDto;
	setCurrentUserInfo: (userInfo: UserInfoDto) => void;
	clearCurrentUserInfo: () => void;
}

export const useCurrentUserInfoStore = create(
	persist<CurrentUserInfoStoreDto>(
		(set) => ({
			currentUserInfo: null,
			setCurrentUserInfo: (userInfo) => set({ currentUserInfo: userInfo }),
			clearCurrentUserInfo: () => set({ currentUserInfo: null }),
		}),
		{
			name: 'KICKON_CURRENT_USER_INFO', // 로컬 스토리지에 저장될 키 이름
		},
	),
);
