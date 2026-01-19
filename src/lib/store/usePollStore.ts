import { create } from 'zustand';
import { toDateTimeLocal } from '@/lib/utils/date/toDateTimeLocal';

interface PollStoreDto {
	title: string;
	options: string[];
	isMultipleChoice: boolean;
	endAt: string;

	setTitle: (title: string) => void;
	setOptions: (options: string[]) => void;
	setIthOption: (option: string, index: number) => void;
	setIsMultipleChoice: (isMultipleChoice: boolean) => void;
	setEndAt: (endAt: string) => void;

	clearPollStore: () => void;
}

const initialState = {
	title: '',
	options: ['', ''],
	isMultipleChoice: false,
	endAt: toDateTimeLocal(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()),
};

export const usePollStore = create<PollStoreDto>((set) => ({
	...initialState,

	setTitle: (title) => set({ title }),
	setOptions: (options) => set({ options }),
	setIthOption: (option, index) =>
		set((state) => ({
			options: state.options.map((item, i) => (i === index ? option : item)),
		})),
	setIsMultipleChoice: (isMultipleChoice) => set({ isMultipleChoice }),
	setEndAt: (endAt: string) => set({ endAt }),

	clearPollStore: () => set(initialState),
}));
