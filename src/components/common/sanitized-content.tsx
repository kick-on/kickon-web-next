'use client';

import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify();

export default function SanitizedContent({ content }: { content: string }) {
	const [sanitizedContent, setSanitizedContent] = useState('');

	useEffect(() => {
		let cleanText = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['p'] })
			.replace(/<\/p>\s*<p>/g, '<br />') // 단락 사이 줄 바꿈 유지
			.replace(/^<p>|<\/p>$/g, ''); // 맨 앞뒤 <p> 제거

		// 2줄까지만 표시 (대략 120자 기준, <br> 포함)
		if (cleanText.length > 120) {
			cleanText = cleanText.substring(0, 117) + '...';
		}

		setSanitizedContent(cleanText);
	}, [content]);

	return (
		<div
			className="mb-[1.125rem] subtitle2-regular font-normal line-clamp-2"
			style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
			dangerouslySetInnerHTML={{ __html: sanitizedContent }}
		/>
	);
}
