import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export function sanitizeHTML(input: string): string {
	let cleanText = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['p'] })
		.replace(/<p>\s*<\/p>/g, '') // 빈 p 제거
		.replace(/<\/p>\s*<p>/g, '<br />') // 줄 바꿈 유지
		.replace(/^<p>|<\/p>$/g, '') // 앞뒤 p 제거
		.trim();

	const maxLength = 120;
	if (cleanText.length > maxLength) {
		cleanText = cleanText.substring(0, maxLength - 3).trim() + '...';
	}

	return cleanText;
}
