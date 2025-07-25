export const stripTime = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isSameDate = (a: Date, b: Date): boolean => stripTime(a).getTime() === stripTime(b).getTime();

export const getStartOfWeek = (date: Date): Date => {
	const day = date.getDay();
	const newDate = new Date(date);
	newDate.setDate(date.getDate() - day);
	return stripTime(newDate);
};

export const getEndOfWeek = (startDate: Date): Date => {
	const newDate = new Date(startDate);
	newDate.setDate(startDate.getDate() + 6);
	return stripTime(newDate);
};

export const getWeekOfMonth = (date: Date) => {
	const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	const firstDayOfWeek = firstDay.getDay(); // 일:0~토:6
	const offset = date.getDate() + firstDayOfWeek - 1;

	return Math.floor(offset / 7) + 1;
};
