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
