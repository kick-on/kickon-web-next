import { isSameDate, stripTime } from '@/lib/utils';

interface TileClassNameProps {
	date: Date;
	firstDayOfCurrentMonth: Date;
	isCollapsed: boolean;
	startOfWeek: Date;
	endOfWeek: Date;
	today: Date;
	selectedDate: Date | null;
	isMatch: boolean;
	predictionRange: { start: Date; end: Date } | null;
	markedDatesMap: Record<string, number>;
}

export const getTileClassName = ({
	date,
	firstDayOfCurrentMonth,
	isCollapsed,
	startOfWeek,
	endOfWeek,
	today,
	selectedDate,
	isMatch,
	predictionRange,
	markedDatesMap,
}: TileClassNameProps) => {
	const d = stripTime(date);
	const isCurrentMonth = date.getMonth() === firstDayOfCurrentMonth.getMonth();
	if (!isCurrentMonth) return 'hidden-other-month-tile';
	if (isCollapsed && (d < startOfWeek || d > endOfWeek)) return 'hidden-tile';

	const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	const hasMatch = markedDatesMap[dStr] > 0;

	if (predictionRange && d > predictionRange.end) {
		const classes = ['disabled-after'];
		const dayOfWeek = date.getDay();

		const prevDate = new Date(date);
		prevDate.setDate(prevDate.getDate() - 1);
		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + 1);

		const isPrevDisabled = stripTime(prevDate) > predictionRange.end;
		const isNextDisabled = stripTime(nextDate) > predictionRange.end;

		if (dayOfWeek === 0 || !isPrevDisabled) classes.push('disabled-after-week-start');
		if (dayOfWeek === 6 || !isNextDisabled) classes.push('disabled-after-week-end');

		return classes.join(' ');
	}

	const isFocused = selectedDate && isSameDate(d, selectedDate);
	const isToday = isSameDate(d, today);

	let baseClass = '';
	if (isFocused && isToday) baseClass = 'focused-today-tile';
	else if (isFocused) baseClass = 'focused-tile';
	else if (isToday) baseClass = 'not-focused-today-tile';
	else if (d < today) baseClass = isMatch ? 'past-tile pointer-events-none' : 'future-tile';
	else baseClass = isMatch ? 'future-tile' : 'past-tile pointer-events-none';

	return `${baseClass} ${hasMatch ? 'has-match' : ''}`.trim();
};
