export const formatDate = (createdAt: string, year?: 'numeric' | '2-digit') => {
	const date = createdAt ? new Date(createdAt) : new Date();

	// numeric: YYYY.MM.DD
	// 2-digit: YY.MM.DD
	// undefined: MM.DD
	const formattedDate = new Intl.DateTimeFormat('ko-KR', {
		year: year,
		month: '2-digit',
		day: '2-digit',
	})
		.format(date)
		.replace(/\s/g, '')
		.replace(/\.$/, '');

	// W
	const formattedWeekday = new Intl.DateTimeFormat('ko-KR', {
		weekday: 'short',
	}).format(date);

	// HH:mm
	const formattedTime = new Intl.DateTimeFormat('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // 24시간 형식
	}).format(date);

	return { formattedDate, formattedWeekday, formattedTime };
};
