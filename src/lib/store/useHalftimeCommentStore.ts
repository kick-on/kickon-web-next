import { create } from 'zustand';

interface IsHalftimeCommentOpenDto {
	isHalftimeCommentOpen: boolean;
	openHalftimeComment: () => void;
	closeHalftimeComment: () => void;
	toggleHalftimeComment: () => void;
}

export const useIsHalftimeCommentOpen = create<IsHalftimeCommentOpenDto>((set) => ({
	isHalftimeCommentOpen: false,
	openHalftimeComment: () => set({ isHalftimeCommentOpen: true }),
	closeHalftimeComment: () => set({ isHalftimeCommentOpen: false }),
	toggleHalftimeComment: () => set((state) => ({ isHalftimeCommentOpen: !state.isHalftimeCommentOpen })),
}));
