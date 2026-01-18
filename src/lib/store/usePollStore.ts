import { create } from 'zustand';

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

export const usePollStore = create<PollStoreDto>((set) => ({
	title: '',
	options: ['', ''],
	isMultipleChoice: false,
	endAt: '',

	setTitle: (title) => set({ title }),
	setOptions: (options) => set({ options }),
	setIthOption: (option, index) =>
		set((state) => ({
			options: state.options.map((item, i) => (i === index ? option : item)),
		})),
	setIsMultipleChoice: (isMultipleChoice) => set({ isMultipleChoice }),
	setEndAt: (endAt: string) => set({ endAt }),

	clearPollStore: () => set({ title: '', options: ['', ''], isMultipleChoice: false, endAt: '' }),
}));
