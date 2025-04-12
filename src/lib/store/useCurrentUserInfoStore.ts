import { UserInfoDto } from '@/services/auth/dto';
import { create } from 'zustand';

interface CurrentUserInfoStoreDto {
	currentUserInfo: UserInfoDto;
	setCurrentUserInfo: (userInfo: UserInfoDto) => void;
	clearCurrentUserInfo: () => void;
}

export const useCurrentUserInfoStore = create<CurrentUserInfoStoreDto>((set) => ({
	currentUserInfo: null,
	setCurrentUserInfo: (userInfo) => set({ currentUserInfo: userInfo }),
	clearCurrentUserInfo: () => set({ currentUserInfo: null }),
}));
