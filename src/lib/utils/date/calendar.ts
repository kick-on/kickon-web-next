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
	selectedDate: Date; // 사용자가 선택한 날짜
	isWeekCalendar: boolean;
	isMatch: boolean;
	markedDatesMap: Record<string, number>;
}
export const getTileClassName = ({
	dateOfTile,
	selectedDate,
	isWeekCalendar,
	isMatch,
	markedDatesMap,
}: TileClassNameProps) => {
	const tileDate = stripTime(dateOfTile);

	if (!isWeekCalendar && selectedDate && dateOfTile.getMonth() !== selectedDate.getMonth()) {
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

	// 오늘 / 선택 상태
	const isFocused = selectedDate && isSameDate(tileDate, selectedDate);
	const isToday = isSameDate(tileDate, stripTime(new Date()));

	const classes = [];

	// 오늘 타일 스타일링
	if (isToday) {
		classes.push(isFocused ? 'focused-today-tile' : 'not-focused-today-tile');
	}

	// 경기가 있는 타일 스타일링
	if (hasMatch) {
		classes.push('has-match');
	}

	// 활성/비활성 타일 스타일링
	const predictResultActiveTile = !isMatch && hasMatch;
	const isActiveTile = isMatch || predictResultActiveTile;

	if (isActiveTile) {
		classes.push(isFocused ? 'focused-tile' : 'active-tile');
	} else {
		classes.push('disabled-tile pointer-events-none');
	}

	return classes.join(' ');
};
