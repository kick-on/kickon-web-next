export const trimTextWithoutSpaces = (text?: string, maxVisibleChars: number = 5): string => {
	const safeText = text ?? '';

	if (safeText.replace(/\s/g, '').length <= maxVisibleChars) return safeText;

	let visibleCount = 0;
	let result = '';

	for (const char of safeText) {
		if (char !== ' ') visibleCount++;
		result += char;
		if (visibleCount === maxVisibleChars) break;
	}

	return result + '...';
};
