import { UserInfoDto } from '@/services/auth/dto';
import { create } from 'zustand';

interface CurrentUserInfoStoreDto {
	currentUserInfo: UserInfoDto;
	setCurrentUserInfo: (userInfo: UserInfoDto) => void;
}

export const useCurrentUserInfoStore = create<CurrentUserInfoStoreDto>((set) => ({
	currentUserInfo: null,
	setCurrentUserInfo: (userInfo) => set({ currentUserInfo: userInfo }),
}));
