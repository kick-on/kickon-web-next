import { BaseHalftimeDto, GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 하프타임 목록에서 저장할 pk 배열
interface AllHalftimePksStore {
	allHalftimePks: number[];
	appendAllHalftimePks: (halftimes: BaseHalftimeDto[]) => void;
	clearAllHalftimePks: () => void;
}

export const useAllHalftimePksStore = create(
	persist<AllHalftimePksStore>(
		(set) => ({
			allHalftimePks: [],
			appendAllHalftimePks: (halftimes) =>
				set((state) => ({ allHalftimePks: [...state.allHalftimePks, ...halftimes.map((h) => h.pk)] })),
			clearAllHalftimePks: () => set(() => ({ allHalftimePks: [] })),
		}),
		{
			name: 'KICKON_ALL_HALFTIMES', // 로컬 스토리지에 저장될 키 이름
		},
	),
);

// 하프타임 상세에서 사용할 halftime 배열
interface ViewedHalftimesStore {
	viewedHalftimes: GetHalftimeDetailDto[];
	appendViewedHalftime: (halftime: GetHalftimeDetailDto) => void;
	clearViewedHalftimes: () => void;
}

export const useViewedHalftimesStore = create(
	persist<ViewedHalftimesStore>(
		(set) => ({
			viewedHalftimes: [],
			appendViewedHalftime: (halftime) =>
				set((state) => ({
					viewedHalftimes: [...(state.viewedHalftimes || []), halftime],
				})),
			clearViewedHalftimes: () => set(() => ({ viewedHalftimes: [] })),
		}),
		{
			name: 'KICKON_VIEWED_HALFTIMES',
		},
	),
);
