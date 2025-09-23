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

interface TileClassNameProps {
	dateOfTile: Date; //캘린더 기준 현재 날짜
	firstDayOfCurrentMonth: Date;
	today: Date; // 오늘 날짜
	selectedDate: Date | null; // 사용자가 선택한 날짜
	isCollapsed: boolean;
	isMatch: boolean;
	predictionRange: { start: Date; end: Date } | null;
	markedDatesMap: Record<string, number>;
}
export const getTileClassName = ({
	dateOfTile,
	firstDayOfCurrentMonth,
	today,
	selectedDate,
	isCollapsed,
	isMatch,
	predictionRange,
	markedDatesMap,
}: TileClassNameProps) => {
	const d = stripTime(dateOfTile);
	const isCurrentMonth = dateOfTile.getMonth() === firstDayOfCurrentMonth.getMonth();
	if (!isCurrentMonth) return 'hidden-other-month-tile';

	// selectedDate로 이번 주 범위 계산
	let startOfWeek: Date | null = null;
	let endOfWeek: Date | null = null;
	if (selectedDate) {
		startOfWeek = getStartOfWeek(selectedDate);
		endOfWeek = getEndOfWeek(startOfWeek);
	}

	if (isCollapsed && selectedDate && (d < startOfWeek! || d > endOfWeek!)) {
		return 'hidden-tile'; // 히든 타일로 바뀌면서 트랜지션 발생
	}
	const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	const hasMatch = markedDatesMap[dStr] > 0;

	if (predictionRange && d > predictionRange.end) {
		const classes = ['disabled-after'];
		const dayOfWeek = dateOfTile.getDay();

		const prevDate = new Date(dateOfTile);
		prevDate.setDate(prevDate.getDate() - 1);
		const nextDate = new Date(dateOfTile);
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
