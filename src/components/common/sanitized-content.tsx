'use client';

import { useEffect, useState, useMemo } from 'react';
import createDOMPurify from 'dompurify';

export default function SanitizedContent({ content }: { content: string }) {
	const DOMPurify = useMemo(() => createDOMPurify(), []);
	const [sanitizedContent, setSanitizedContent] = useState('');

	useEffect(() => {
		let cleanText = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['p'] })
			.replace(/<p>\s*<\/p>/g, '') // 빈 p 제거
			.replace(/<\/p>\s*<p>/g, '<br />') // 줄 바꿈 유지
			.replace(/^<p>|<\/p>$/g, '') // 앞뒤 p 제거
			.trim();

		const maxLength = 120;
		if (cleanText.length > maxLength) {
			cleanText = cleanText.substring(0, maxLength - 3).trim() + '...';
		}

		setSanitizedContent(cleanText);
	}, [content, DOMPurify]);

	return (
		<div
			className="mb-[1.125rem] subtitle2-regular font-normal"
			style={{
				display: '-webkit-box',
				WebkitBoxOrient: 'vertical',
				WebkitLineClamp: 3,
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			}}
			dangerouslySetInnerHTML={{ __html: sanitizedContent }}
		/>
	);
}
