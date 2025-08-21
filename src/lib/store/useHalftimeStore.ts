import {
	GetHalftimeDetailDto,
	GetHalftimeListRequest,
	GetHalftimeListResponse,
} from '@/services/apis/shorts/shorts.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// react query key
interface HalftimeQueryKeyStore {
	_hasHydrated: boolean;
	halftimeListQueryKey: [string, string, number];
	setSort: (sort: string) => void;
}

export const useHalftimeQueryKeyStore = create(
	persist<HalftimeQueryKeyStore>(
		(set) => ({
			_hasHydrated: false,
			halftimeListQueryKey: ['halftimeList', 'CREATED_DESC', 12],
			setSort: (sort) =>
				set((state) => ({ halftimeListQueryKey: ['halftimeList', sort, state.halftimeListQueryKey[2]] })),
		}),
		{
			name: 'KICKON_HALFTIME_QUERY_KEY', // 로컬 스토리지에 저장될 키 이름
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

// 하프타임 목록에서 저장할 pk 배열
interface AllHalftimePksStore {
	_hasHydrated: boolean;
	queryKey: [string, string, number];
	hasNext: boolean;
	nextParams: GetHalftimeListRequest | null;
	allHalftimePks: number[];
	setSort: (sort: string) => void;
	appendAllHalftimePks: (
		nextParams: GetHalftimeListRequest,
		halftimes: GetHalftimeListResponse,
		pkToPrepend?: number,
	) => void;
	clearAllHalftimePks: () => void;
}

export const useAllHalftimePksStore = create(
	persist<AllHalftimePksStore>(
		(set) => ({
			_hasHydrated: false,
			queryKey: ['halftimeList', 'CREATED_DESC', 12],
			hasNext: false,
			nextParams: null,
			allHalftimePks: [],
			setSort: (sort) => set((state) => ({ queryKey: ['halftimeList', sort, state.queryKey[2]] })),
			appendAllHalftimePks: (nextParams, response, pkToPrepend) =>
				set((state) => ({
					hasNext: response.meta.hasNext,
					nextParams,
					allHalftimePks: [
						...state.allHalftimePks,
						...(pkToPrepend ? [pkToPrepend] : []),
						...response.data.map((h) => h.pk),
					],
				})),
			clearAllHalftimePks: () => set(() => ({ hasNext: false, nextParams: null, allHalftimePks: [] })),
		}),
		{
			name: 'KICKON_ALL_HALFTIMES', // 로컬 스토리지에 저장될 키 이름
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

// 하프타임 상세에서 사용할 halftime 배열
interface ViewedHalftimesStore {
	_hasHydrated: boolean;
	viewedHalftimes: GetHalftimeDetailDto[];
	appendViewedHalftime: (halftime: GetHalftimeDetailDto) => void;
	toggleIsKicked: (pk: number) => void;
	clearViewedHalftimes: () => void;
}

export const useViewedHalftimesStore = create(
	persist<ViewedHalftimesStore>(
		(set) => ({
			_hasHydrated: false,
			viewedHalftimes: [],
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
