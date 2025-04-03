'use client';

import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify();

export default function SanitizedContent({ content }: { content: string }) {
	const [sanitizedContent, setSanitizedContent] = useState('');

	useEffect(() => {
		setSanitizedContent(DOMPurify.sanitize(content, { FORBID_TAGS: ['img'] }));
	}, [content]);

	return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
