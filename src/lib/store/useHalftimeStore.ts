import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import { create } from 'zustand';

interface HalftimesStore {
	halftimes: GetHalftimeDetailDto[];
	pushHalftimes: (halftime: GetHalftimeDetailDto) => void;
}

export const useHalftimes = create<HalftimesStore>((set) => ({
	halftimes: [],
	pushHalftimes: (halftime) =>
		set((state) => ({
			halftimes: [...(state.halftimes || []), halftime],
		})),
}));
