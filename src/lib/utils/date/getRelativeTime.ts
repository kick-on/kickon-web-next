export const getRelativeTime = (dateString: string) => {
	const date = new Date(dateString);

	// 현재 시간을 UTC로 맞추기
	const now = new Date();
	const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

	const absTime = Math.abs(nowUTC.getTime() - date.getTime());
	const diffInSeconds = Math.floor(absTime / 1000);

	const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

	if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second'); // "몇 초 전"
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute'); // "몇 분 전"
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return rtf.format(-diffInHours, 'hour'); // "몇 시간 전"
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) return rtf.format(-diffInDays, 'day'); // "몇 일 전"
	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month'); // "몇 달 전"
	const diffInYears = Math.floor(diffInDays / 365);
	return rtf.format(-diffInYears, 'year'); // "몇 년 전"
};
