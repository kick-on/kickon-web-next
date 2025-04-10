export const formatStringToDate = (createdAt: string, year = 'numeric' as 'numeric' | '2-digit', hasTime = false) => {
	const date = new Date(createdAt);
	date.setHours(date.getHours() + 9);

	const formattedDate = new Intl.DateTimeFormat('ko-KR', {
		year: year,
		month: '2-digit',
		day: '2-digit',
	})
		.format(date)
		.replace(/\s/g, '')
		.replace(/\.$/, '');

	const formattedTime = new Intl.DateTimeFormat('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // 24시간 형식
	}).format(date);

	return formattedDate + (hasTime ? ' ' + formattedTime : '');
};
