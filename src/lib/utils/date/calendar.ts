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
	isWeekCalendar: boolean;
	isMatch: boolean;
	predictionRange: { start: Date; end: Date } | null;
	markedDatesMap: Record<string, number>;
}
export const getTileClassName = ({
	dateOfTile,
	firstDayOfCurrentMonth,
	today,
	selectedDate,
	isWeekCalendar,
	isMatch,
	predictionRange,
	markedDatesMap,
}: TileClassNameProps) => {
	const tileDate = stripTime(dateOfTile);

	if (!isWeekCalendar && firstDayOfCurrentMonth && dateOfTile.getMonth() !== firstDayOfCurrentMonth.getMonth()) {
		return 'hidden-other-month-tile';
	}

	// collapsed 모드일 때는 !isCollapsed 조건이 false -> month 체크 안 함 -> 모든 타일 보임
	// collapsed가 false일 때만 month 체크 -> 이번 달 아닌 타일 숨김

	// selectedDate로 이번 주 범위 계산
	let startOfWeek: Date | null = null;
	let endOfWeek: Date | null = null;
	if (selectedDate) {
		startOfWeek = getStartOfWeek(selectedDate);
		endOfWeek = getEndOfWeek(startOfWeek);
	}

	if (isWeekCalendar && selectedDate && (tileDate < startOfWeek! || tileDate > endOfWeek!)) {
		return 'hidden-tile';
	}

	// marked date 여부
	const dStr = `${tileDate.getFullYear()}-${String(tileDate.getMonth() + 1).padStart(2, '0')}-${String(tileDate.getDate()).padStart(2, '0')}`;
	const hasMatch = markedDatesMap[dStr] > 0;

	// predictionRange 처리
	if (predictionRange && tileDate > predictionRange.end) {
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

	// 오늘 / 선택 상태
	const isFocused = selectedDate && isSameDate(tileDate, selectedDate);
	const isToday = isSameDate(tileDate, today);

	if (isToday) {
		if (isFocused) return 'focused-today-tile';
		return 'not-focused-today-tile';
	}

	// 활성화 / 비활성화 구분
	if (isMatch) {
		// 오늘 기준 과거 -> disabled
		if (tileDate < today) return 'disabled-tile pointer-events-none';
		// 오늘 포함 미래 -> active
		return isFocused ? 'focused-tile' : 'active-tile';
	} else {
		// hasMatch 없으면 disabled
		if (!hasMatch) return 'disabled-tile pointer-events-none';
		// hasMatch 있으면 active
		return isFocused ? 'focused-tile' : 'active-tile';
	}
};
