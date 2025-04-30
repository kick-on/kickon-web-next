'use client';
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
	const [hasMention, setHasMention] = useState(false);
	const [hasNewLine, setHasNewLine] = useState(false);

	// 멘션 추가 처리
	const insertMentionIfNeeded = () => {
		if (type === 'reply' && mentionNickname && mentionNickname !== 'undefined' && inputRef.current) {
			const mention = `<span contenteditable="false" style="color: #890f0e" class="mention">@${mentionNickname}</span>&nbsp;`;
			inputRef.current.innerHTML = mention;
			setHasMention(true);

			// 커서를 멘션 뒤로 이동
			const range = document.createRange();
			const sel = window.getSelection();
			if (inputRef.current.lastChild) {
				range.setStartAfter(inputRef.current.lastChild);
				range.collapse(true);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
		}
	};

	// 커스텀 스크롤 위치 및 thumb 계산
	const updateScrollThumb = () => {
		const input = inputRef.current;
		const thumb = thumbRef.current;
		if (!input || !thumb) return;

		const { scrollTop, scrollHeight, clientHeight } = input;
		if (scrollHeight <= clientHeight) {
			thumb.style.opacity = '0';
			setHasScroll(false);
			return;
		}

		thumb.style.opacity = '1';
		setHasScroll(true);

		const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
		const scrollRatio = scrollTop / (scrollHeight - clientHeight);
		const thumbTop = scrollRatio * (clientHeight - thumbHeight);

		setScrollThumbHeight(thumbHeight);
		thumb.style.transform = `translateY(${thumbTop}px)`;
	};

	// 키 이벤트 처리 (엔터, 백스페이스 등)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (!hasMention) return;

		const mentionEl = inputRef.current?.querySelector('.mention');
		if (!mentionEl) return;

		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);

		if (e.key === 'Enter') {
			setHasNewLine(true);
			return;
		}

		if (e.key === 'Backspace') {
			const mentionRect = mentionEl.getBoundingClientRect();
			const cursorRect = range.getBoundingClientRect();

			if (hasNewLine) {
				if (cursorRect.left <= mentionRect.right + 5 && Math.abs(cursorRect.top - mentionRect.top) < 5) {
					e.preventDefault(); // 멘션 바로 뒤면 삭제 막음
					return;
				}
				return; // 그 외는 허용
			}

			// 줄바꿈 없을 때 멘션 보호
			if (cursorRect.left <= mentionRect.right + 5) {
				e.preventDefault();
			}
		}
	};

	// 입력 이벤트 처리
	const handleInput = () => {
		if (!inputRef.current) return;

		const html = inputRef.current.innerHTML;
		setHasNewLine(/<br>|<div>/i.test(html));

		if (hasMention) {
			const mentionEl = inputRef.current.querySelector('.mention');
			if (!mentionEl && mentionNickname) {
				// 멘션 복구
				const mention = document.createElement('span');
				mention.contentEditable = 'false';
				mention.style.color = '#890f0e';
				mention.className = 'mention';
				mention.textContent = `@${mentionNickname}`;

				const currentHTML = inputRef.current.innerHTML;
				inputRef.current.innerHTML = '';
				inputRef.current.appendChild(mention);
				inputRef.current.insertAdjacentHTML('beforeend', '&nbsp;');

				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = currentHTML;
				let cleanHTML = tempDiv.innerHTML;
				cleanHTML = cleanHTML.replace(new RegExp(`<span[^>]*>@${mentionNickname}</span>&nbsp;`, 'i'), '');
				if (cleanHTML.trim()) {
					inputRef.current.insertAdjacentHTML('beforeend', cleanHTML);
				}

				// 커서 이동
				const range = document.createRange();
				const sel = window.getSelection();
				range.setStartAfter(inputRef.current.lastChild!);
				range.collapse(true);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}

			const inputText = inputRef.current.innerText;
			const textWithoutMention = inputText.replace(`@${mentionNickname}`, '').trim();
			setContent(textWithoutMention);
			setCharCount(textWithoutMention.length);
		} else {
			const inputText = inputRef.current.innerText.trim();
			setContent(inputText);
			setCharCount(inputText.length);
		}
	};

	// 댓글 등록
	// 댓글 등록
	const handleSubmit = async () => {
		if (!getAccessToken() || !getRefreshToken()) {
			setIsLoginModalOpen(true);
			return;
		}
		if (!content.trim()) return alert('내용을 입력해주세요!');
		if (isSubmitting) return;

		setIsSubmitting(true);
		const isReply = type === 'reply';

		let sanitizedContent = content;
		if (hasMention && mentionNickname) {
			const mentionPattern = new RegExp(`^@${mentionNickname}&nbsp;`);
			sanitizedContent = sanitizedContent.replace(mentionPattern, '');
		}

		const requestBody = {
			contents: sanitizedContent,
			...(isReply && parentReplyId ? { parentReply: parentReplyId } : {}),
			...(contentType === 'news' ? { news: contentsId } : {}),
			...(contentType === 'board' ? { board: contentsId } : {}),
		};

		try {
			const response = await postCreateReply(contentType, requestBody);
			console.log('작성한 댓글', requestBody, response);

			setContent('');
			if (inputRef.current) inputRef.current.innerHTML = '';
			setHasNewLine(false);

			// 댓글 등록 성공 이후에 리스트 갱신 호출
			onCommentSubmit?.(isReply);
		} catch (error) {
			console.error('댓글 등록 실패:', error);
			alert('댓글 등록에 실패했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// useEffect 모음
	useEffect(insertMentionIfNeeded, [mentionNickname, type]);

	useEffect(() => {
		updateScrollThumb();
		const input = inputRef.current;
		input?.addEventListener('scroll', updateScrollThumb);
		window.addEventListener('resize', updateScrollThumb);
		return () => {
			input?.removeEventListener('scroll', updateScrollThumb);
			window.removeEventListener('resize', updateScrollThumb);
		};
	}, []);

	return (
		<div className={type === 'reply' ? 'mt-3.5' : 'bg-black-200 rounded-[0.625rem] p-4 mb-10 flex flex-col gap-4'}>
			{type !== 'reply' && <h3 className="subtitle1-medium">댓글 쓰기</h3>}
			<div className={clsx('flex', hasScroll ? 'gap-1' : 'gap-0', type === 'reply' ? 'h-20' : 'h-[6.5rem]')}>
				{/* 입력창 */}
				<div className="relative w-full">
					<div
						ref={inputRef}
						contentEditable
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						className={clsx(
							'relative w-full h-full p-4 pb-3 rounded-l-[0.625rem] resize-none focus:outline-none overflow-y-scroll no-scrollbar body6-regular text-left',
							type === 'reply' ? 'bg-black-100' : 'bg-black-000 h-full',
							content.trim().length === 0 && 'empty-placeholder',
						)}
						data-placeholder="욕설 및 유해한 내용의 댓글은 통보없이 삭제될 수 있습니다."
						suppressContentEditableWarning
					/>
				</div>

				{/* 스크롤바 */}
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
