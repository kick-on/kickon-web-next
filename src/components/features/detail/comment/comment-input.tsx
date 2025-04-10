'use clinet';
import LoginModal from '@/components/common/login-modal/login-modal';
import { getAccessToken, getRefreshToken } from '@/lib/utils/getAccessToken';
import { postCreateReply } from '@/services/apis/detail/comment';
import { CommentInputProps } from '@/services/apis/detail/comment/dto';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const CommentInput = ({
	type = 'comment',
	mentionNickname,
	contentsId,
	parentReplyId,
	contentType,
	onCommentSubmit,
}: CommentInputProps) => {
	const inputRef = useRef<HTMLDivElement>(null);
	const thumbRef = useRef<HTMLDivElement>(null);
	const [scrollThumbHeight, setScrollThumbHeight] = useState(0);
	const [content, setContent] = useState('');
	const [, setCharCount] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const [hasScroll, setHasScroll] = useState(false);

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

			if (scrollHeight <= clientHeight) {
				thumb.style.opacity = '0'; // thumb 안 보이게
				setHasScroll(false);
				return;
			} else {
				thumb.style.opacity = '1'; // thumb 보이게
				setHasScroll(true);
			}

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
		if (!getAccessToken() || !getRefreshToken()) {
			setIsLoginModalOpen(true);
			return;
		}
		if (!content.trim()) return alert('내용을 입력해주세요!');
		if (isSubmitting) return;

		setIsSubmitting(true);
		setTimeout(() => {
			onCommentSubmit?.();
		}, 300);

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
			<div className={clsx('flex', hasScroll ? 'gap-1' : 'gap-0', type === 'reply' ? 'h-20' : 'h-[6.5rem]')}>
				<div className="relative w-full">
					<div
						ref={inputRef}
						contentEditable
						onInput={handleInput}
						className={clsx(
							'relative w-full h-full p-4 pb-3 rounded-l-[0.625rem] resize-none focus:outline-none overflow-y-scroll no-scrollbar body6-regular text-left',
							type === 'reply' ? 'bg-black-100' : 'bg-black-000 h-full',
							content.trim().length === 0 && 'empty-placeholder',
						)}
						data-placeholder="욕설 및 유해한 내용의 댓글은 통보없이 삭제될 수 있습니다."
						suppressContentEditableWarning={true}
					/>
				</div>

				{/* 커스텀 스크롤바 */}
				<div
					className={`relative ${hasScroll ? 'w-[0.5rem]' : 'w-0'} rounded-md overflow-hidden ${type === 'reply' ? 'bg-black-200 h-20' : 'h-full'}`}
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
					disabled={isSubmitting || content.trim().length === 0}
					className={clsx(
						'w-13.5 h-full border border-black-300 text-black-000 button3-regular rounded-r-[0.625rem]',
						isSubmitting || content.trim().length === 0 ? 'bg-black-400' : 'bg-primary-900',
					)}
				>
					등록
				</button>
			</div>
			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
};

export default CommentInput;
