export const isPastDate = (dateStr: string) => {
	const date = new Date(dateStr);
	const now = new Date();

	return now.getTime() - date.getTime() > 0;
};
