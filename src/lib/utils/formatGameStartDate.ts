export const formatGameStartDate = (startAt): [string, string] => {
	const date = new Date(startAt);
	date.setHours(date.getHours() + 9);

	// 날짜 포맷 (MM.DD (요일))
	const dateStr = new Intl.DateTimeFormat('ko-KR', {
		month: '2-digit',
		day: '2-digit',
		weekday: 'short',
	}).format(date);

	// 시간 포맷 (HH:mm)
	const timeStr = new Intl.DateTimeFormat('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // 24시간 형식
	}).format(date);

	// 날짜 형식 조정 (01.25 (토))
	const [month, day, weekday] = dateStr.split('. ');
	const formattedDate = `${month}.${day} ${weekday}`;

	// 시간 형식 조정 (04:07)
	const formattedTime = timeStr.replace(/\s/g, ''); // 공백 제거

	return [formattedDate, formattedTime];
};
