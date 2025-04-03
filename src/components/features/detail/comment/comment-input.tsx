'use clinet';
import { postCreateReply } from '@/services/apis/detail/comment';
import { useEffect, useRef, useState } from 'react';

interface CommentInputProps {
	type?: 'comment' | 'reply';
	mentionNickname?: string;
	parentReplyId?: number;
	contentType: 'news' | 'board';
	contentsId: number;
}

const CommentInput = ({
	type = 'comment',
	mentionNickname,
	contentsId,
	parentReplyId,
	contentType,
}: CommentInputProps) => {
	const inputRef = useRef<HTMLDivElement>(null);
	const thumbRef = useRef<HTMLDivElement>(null);
	const [scrollThumbHeight, setScrollThumbHeight] = useState(0);
	const [content, setContent] = useState('');
	const [, setCharCount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (type === 'reply' && mentionNickname && inputRef.current) {
			inputRef.current.innerHTML = `<span style="color: #890f0e">@${mentionNickname}</span>&nbsp;`;
		}
	}, [mentionNickname, type]);

	useEffect(() => {
		const input = inputRef.current;
		const thumb = thumbRef.current;

		const updateScrollThumb = () => {
			if (!input || !thumb) return;

			const scrollTop = input.scrollTop;
			const scrollHeight = input.scrollHeight;
			const clientHeight = input.clientHeight;

			const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
			setScrollThumbHeight(thumbHeight);

			const scrollRatio = scrollTop / (scrollHeight - clientHeight);
			const thumbTop = scrollRatio * (clientHeight - thumbHeight);

			thumb.style.transform = `translateY(${thumbTop}px)`;
		};

		updateScrollThumb();
		input?.addEventListener('scroll', updateScrollThumb);
		window.addEventListener('resize', updateScrollThumb);

		return () => {
			input?.removeEventListener('scroll', updateScrollThumb);
			window.removeEventListener('resize', updateScrollThumb);
		};
	}, []);

	const handleInput = () => {
		if (inputRef.current) {
			const inputText = inputRef.current.innerHTML;
			const plainText = inputText.replace(/<[^>]*>/g, ''); // HTML 태그 제거

			// @mentionNickname&nbsp; 포함해서 제거
			const mentionPattern = new RegExp(`^@${mentionNickname}&nbsp;`);
			const textWithoutMention = mentionPattern.test(plainText)
				? plainText.replace(mentionPattern, '') // 멘션 제거
				: plainText;

			if (textWithoutMention.length <= 1000) {
				setContent(textWithoutMention);
				setCharCount(textWithoutMention.length);
			}
		}
	};
	const handleSubmit = async () => {
		if (!content.trim()) return alert('내용을 입력해주세요!');
		if (isSubmitting) return;

		setIsSubmitting(true);

		// request 보내기 전에 @mentionNickname 제거
		const mentionPattern = new RegExp(`^@${mentionNickname}&nbsp;`);
		const sanitizedContent = mentionPattern.test(content) ? content.replace(mentionPattern, '') : content;

		const requestBody = {
			contents: sanitizedContent, // 멘션 제거한 내용만 전송
			...(type === 'reply' && parentReplyId ? { parentReply: parentReplyId } : {}),
			...(contentType === 'news' ? { news: contentsId } : {}),
			...(contentType === 'board' ? { board: contentsId } : {}),
		};
		console.log(requestBody);

		await postCreateReply(contentType, requestBody);

		setContent('');
		if (inputRef.current) inputRef.current.innerHTML = '';
		setIsSubmitting(false);
	};

	return (
		<div className={type === 'reply' ? 'mt-3.5' : 'bg-black-200 rounded-[0.625rem] p-4 mb-10 flex flex-col gap-4'}>
			{type !== 'reply' && <h3 className="subtitle1-medium">댓글 쓰기</h3>}
			<div className={`flex gap-2 ${type === 'reply' ? 'h-20' : 'h-[6.5rem]'}`}>
				<div className="relative w-full">
					<div
						ref={inputRef}
						contentEditable
						onInput={handleInput}
						className={`w-full h-full p-4 pb-3 rounded-l-[0.625rem] resize-none focus:outline-none overflow-y-scroll no-scrollbar body6-regular
              ${type === 'reply' ? 'bg-black-100' : 'bg-black-000 h-full'} text-left`}
						suppressContentEditableWarning={true}
					/>
				</div>

				{/* 커스텀 스크롤바 */}
				<div
					className={`relative w-[0.5rem] rounded-md overflow-hidden ${type === 'reply' ? 'bg-black-200 h-20' : 'h-full'}`}
				>
					<div
						ref={thumbRef}
						className="absolute top-0 left-0 w-full bg-black-500 rounded-full"
						style={{ height: `${scrollThumbHeight}px` }}
					/>
				</div>

				{/* 등록 버튼 */}
				<button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={`w-13.5 h-full bg-primary-900 border border-black-300 text-black-000 button3-regular rounded-r-[0.625rem] ${
						isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					등록
				</button>
			</div>
		</div>
	);
};

export default CommentInput;
