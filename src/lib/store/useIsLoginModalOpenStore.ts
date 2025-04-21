import { create } from 'zustand';

interface IsLoginModalOpenStoreDto {
	isLoginModalOpen: boolean;
	openLoginModal: () => void;
	closeLoginModal: () => void;
}

export const useIsLoginModalOpenStore = create<IsLoginModalOpenStoreDto>((set) => ({
	isLoginModalOpen: false,
	openLoginModal: () => set({ isLoginModalOpen: true }),
	closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
