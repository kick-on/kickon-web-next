export const formatStringToDate = (createdAt: string) => {
	const date = new Date(createdAt);

	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
		.format(date)
		.replace(/\s/g, '')
		.replace(/\.$/, '');
};
