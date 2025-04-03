export const formatStringToDate = (createdAt: string) => {
	const date = new Date(createdAt);
	date.setHours(date.getHours() + 9);

	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
		.format(date)
		.replace(/\s/g, '')
		.replace(/\.$/, '');
};
