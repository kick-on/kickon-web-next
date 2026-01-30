export const toDateTimeLocal = (isoString: string) => {
	if (!isoString) return '';
	const date = new Date(isoString);

	// sv-SE: YYYY-MM-DD HH:mm 형식
	return new Intl.DateTimeFormat('sv-SE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})
		.format(date)
		.replace(' ', 'T');
};
