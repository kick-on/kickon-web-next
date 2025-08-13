export const addTimestampToFileName = (originalName: string) => {
	const now = new Date();

	// Intl.DateTimeFormat을 사용해 날짜와 시간 부분을 각각 숫자로 포맷
	const formatter = new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	const parts = formatter.formatToParts(now);
	const timestamp = parts
		.filter((part) => part.type !== 'literal') // '.', ' ', ':' 같은 구분자는 제외
		.map((part) => part.value)
		.join(''); // "20250503145809" 같은 문자열로 변환

	const dotIndex = originalName.lastIndexOf('.');
	const name = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
	const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';

	// 특수문자 제거 + 공백은 언더바로 대체
	const cleanedName = name.replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, '_');

	return `${cleanedName}_${timestamp}${ext}`;
};

export function extractMediaFilenamesFromContent(content: string, type: 'img' | 'video'): string[] {
	const regex = new RegExp(`<${type}\\b[^>]*src=["']([^"']+)["']`, 'gi');

	const matches: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = regex.exec(content)) !== null) {
		const url = match[1];
		const filename = decodeURIComponent(url.split('/').pop() || '');
		if (filename) matches.push(filename);
	}

	return matches;
}

export function extractEmbeddedLinks(content: string, filterDomain?: string): string[] {
	const regex = /<iframe\b[^>]*src=["']([^"']+)["']/gi;
	const matches: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = regex.exec(content)) !== null) {
		const url = match[1];
		if (!filterDomain || url.includes(filterDomain)) {
			matches.push(url);
		}
	}

	return matches;
}
