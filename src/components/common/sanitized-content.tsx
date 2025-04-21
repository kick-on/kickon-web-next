import { sanitizeHTML } from '@/lib/utils/sanitizeHTML';

export default function SanitizedContent({ content, isMobile }: { content: string; isMobile: boolean }) {
	const sanitizedContent = sanitizeHTML(content);

	const className = isMobile ? 'body7-regular h-[3.75rem] mb-2.5' : 'subtitle2-regular h-[4.5rem] mb-[1.125rem]';

	return (
		<div
			className={className}
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
