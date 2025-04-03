'use client';

import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify();

export default function SanitizedContent({ content }: { content: string }) {
	const [sanitizedContent, setSanitizedContent] = useState('');

	useEffect(() => {
		setSanitizedContent(DOMPurify.sanitize(content, { FORBID_TAGS: ['img', 'strong', 'p'] }));
	}, [content]);

	return (
		<div
			className="mb-[1.125rem] subtitle2-regular font-normal"
			dangerouslySetInnerHTML={{
				__html: sanitizedContent.length > 120 ? `${sanitizedContent.substring(0, 117)}...` : sanitizedContent,
			}}
		/>
	);
}
