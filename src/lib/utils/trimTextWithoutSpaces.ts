export const trimTextWithoutSpaces = (text: string, maxVisibleChars: number = 5): string => {
	if (text.replace(/\s/g, '').length <= maxVisibleChars) return text;

	let visibleCount = 0;
	let result = '';

	for (const char of text) {
		if (char !== ' ') visibleCount++;
		result += char;
		if (visibleCount === maxVisibleChars) break;
	}

	return result + '...';
};
