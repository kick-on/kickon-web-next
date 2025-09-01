export const separateMonthAndDay = (dateStr: string | undefined) => {
	if (!dateStr) return 'ERROR';

	const date = new Date(dateStr);
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return [
		{ label: '월', value: month },
		{ label: '일', value: day },
	];
};
