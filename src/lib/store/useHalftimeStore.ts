import {
	GetHalftimeDetailDto,
	GetHalftimeListRequest,
	GetHalftimeListResponse,
} from '@/services/apis/shorts/shorts.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 하프타임 목록에서 저장할 pk 배열
interface AllHalftimePksStore {
	hasNext: boolean;
	nextParams: GetHalftimeListRequest | null;
	allHalftimePks: number[];
	appendAllHalftimePks: (nextParams: GetHalftimeListRequest, halftimes: GetHalftimeListResponse) => void;
	clearAllHalftimePks: () => void;
}

export const useAllHalftimePksStore = create(
	persist<AllHalftimePksStore>(
		(set) => ({
			hasNext: false,
			nextParams: null,
			allHalftimePks: [],
			appendAllHalftimePks: (nextParams, response) =>
				set((state) => ({
					hasNext: response.meta.hasNext,
					nextParams,
					allHalftimePks: [...state.allHalftimePks, ...response.data.map((h) => h.pk)],
				})),
			clearAllHalftimePks: () => set(() => ({ hasNext: false, nextParams: null, allHalftimePks: [] })),
		}),
		{
			name: 'KICKON_ALL_HALFTIMES', // 로컬 스토리지에 저장될 키 이름
		},
	),
);

// 하프타임 상세에서 사용할 halftime 배열
interface ViewedHalftimesStore {
	lastViewedHalftimePk: number;
	viewedHalftimes: GetHalftimeDetailDto[];
	setLastViewedHalftimePk: (index: number) => void;
	appendViewedHalftime: (halftime: GetHalftimeDetailDto) => void;
	toggleIsKicked: (pk: number) => void;
	clearViewedHalftimes: () => void;
}

export const useViewedHalftimesStore = create(
	persist<ViewedHalftimesStore>(
		(set) => ({
			lastViewedHalftimePk: -1,
			viewedHalftimes: [],
			setLastViewedHalftimePk: (index) => set(() => ({ lastViewedHalftimePk: index })),
			appendViewedHalftime: (halftime) =>
				set((state) => ({
					viewedHalftimes: [...(state.viewedHalftimes || []), halftime],
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
		},
	),
);
