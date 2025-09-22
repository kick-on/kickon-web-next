import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 조회한 하프타임 상세 리스트
interface ViewedHalftimesStore {
	_hasHydrated: boolean;
	viewedHalftimes: GetHalftimeDetailDto[];
	appendViewedHalftime: (halftime: GetHalftimeDetailDto, nextHalftime?: GetHalftimeDetailDto) => void;
	toggleIsKicked: (pk: number) => void;
	clearViewedHalftimes: () => void;
}

export const useViewedHalftimesStore = create(
	persist<ViewedHalftimesStore>(
		(set) => ({
			_hasHydrated: false,
			viewedHalftimes: [],
			appendViewedHalftime: (halftime, nextHalftime) =>
				set((state) => ({
					viewedHalftimes: [...(state.viewedHalftimes || []), halftime, ...(nextHalftime ? [nextHalftime] : [])],
				})),
			toggleIsKicked: (referencePk) =>
				set((state) => ({
					viewedHalftimes: state.viewedHalftimes.map((h) =>
						h.referencePk === referencePk
							? { ...h, isKicked: !h.isKicked, kickCount: h.isKicked ? h.kickCount - 1 : h.kickCount + 1 }
							: h,
					),
				})),
			clearViewedHalftimes: () => set(() => ({ viewedHalftimes: [] })),
		}),
		{
			name: 'KICKON_VIEWED_HALFTIMES',
			onRehydrateStorage: () => {
				// hydration이 시작될 때 호출
				return (state) => {
					if (state) {
						state._hasHydrated = true;
					}
				};
			},
		},
	),
);
