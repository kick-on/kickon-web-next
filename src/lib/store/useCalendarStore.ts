import { create } from 'zustand';
import { stripTime } from '../utils';

interface CalendarStore {
	selectedDate: Date;
	setSelectedDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
	selectedDate: stripTime(new Date()),
	setSelectedDate: (date: Date) => set({ selectedDate: date }),
}));

export default useCalendarStore;
