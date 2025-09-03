'use client';
import LoginModal from '@/components/common/login-modal/login-content';
import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { CommentInputProps } from './type';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { createNewsReply, patchNewsReply } from '@/services/apis/news/news-reply.api';
import { createBoardReply, patchBoardReply } from '@/services/apis/board/board-reply.api';
import { CreateNewsReplyRequest } from '@/services/apis/news/news-reply.type';
import { CreateBoardReplyRequest } from '@/services/apis/board/board-reply.type';

const CommentInput = ({
	type = 'comment',
	replyTo,
	contentType,
	contentsId,
	editingCommentId,
	defaultContent,
	onCommentSubmit,
	onCommentCancel,
}: CommentInputProps) => {
	const isMobile = useIsMobile();
	const isReply = type === 'reply' && replyTo;
	const currentUserInfo = useCurrentUserInfoStore();
	const inputRef = useRef<HTMLDivElement>(null);
	const [inputHeight, setInputHeight] = useState(0);
	const [content, setContent] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [hasMention, setHasMention] = useState(false);
	const [hasNewLine, setHasNewLine] = useState(false);

	useEffect(() => {
		if (type === 'comment') {
			setInputHeight(isMobile ? 110 : 104);
		} else {
			setInputHeight(isMobile ? 92 : 102);
		}
	}, [isMobile, type]);

	// 멘션 추가 처리
	const insertMentionIfNeeded = () => {
		if (isReply && inputRef.current) {
			const mention = `<span contenteditable="false" style="color: #890f0e" class="mention">@${replyTo.nickname}</span>&nbsp;`;
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
		const el = inputRef.current;
		const newScrollHeight = el.scrollHeight;

		if (type === 'comment') {
			const baseHeight = isMobile ? 110 : 104;
			const maxHeight = isMobile ? 110 : 168;

			const clampedHeight = Math.min(Math.max(baseHeight, newScrollHeight), maxHeight);
			setInputHeight(clampedHeight);
		} else {
			const baseHeight = isMobile ? 92 : 102;
			const maxHeight = isMobile ? 182 : 174;

			const clampedHeight = Math.min(Math.max(baseHeight, newScrollHeight), maxHeight);
			setInputHeight(clampedHeight);
		}

		if (hasMention && replyTo) {
			const mentionEl = inputRef.current.querySelector('.mention');
			if (!mentionEl) {
				// 멘션 복구
				const mention = document.createElement('span');
				mention.contentEditable = 'false';
				mention.style.color = '#890f0e';
				mention.className = 'mention';
				mention.textContent = `@${replyTo.nickname}`;

				const currentHTML = inputRef.current.innerHTML;
				inputRef.current.innerHTML = '';
				inputRef.current.appendChild(mention);
				inputRef.current.insertAdjacentHTML('beforeend', '&nbsp;');

				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = currentHTML;
				let cleanHTML = tempDiv.innerHTML;
				cleanHTML = cleanHTML.replace(new RegExp(`<span[^>]*>@${replyTo.nickname}</span>&nbsp;`, 'i'), '');
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
			const textWithoutMention = inputText.replace(`@${replyTo.nickname}`, '').trim();
			setContent(textWithoutMention);
		} else {
			const inputText = inputRef.current.innerText.trim();
			setContent(inputText);
		}
	};

	// 댓글 등록
	const handleSubmit = async () => {
		if (!currentUserInfo) {
			setIsLoginModalOpen(true);
			return;
		}
		if (!content.trim()) return alert('내용을 입력해주세요!');
		if (isSubmitting) return;

		setIsSubmitting(true);
		setTimeout(onCommentSubmit, 300);

		let sanitizedContent = content;
		if (hasMention && replyTo) {
			const mentionPattern = new RegExp(`^@${replyTo.nickname}&nbsp;`);
			sanitizedContent = sanitizedContent.replace(mentionPattern, '');
		}

		try {
			let response;
			const isNews = contentType === 'news';

			if (type === 'edit') {
				const body = {
					contents: sanitizedContent,
				};

				response = isNews
					? await patchNewsReply(editingCommentId, body)
					: await patchBoardReply(editingCommentId, body);
			} else {
				const isReply = type === 'reply' && replyTo;
				const body: CreateNewsReplyRequest | CreateBoardReplyRequest = {
					contents: sanitizedContent,
					...(isReply ? { parentReply: replyTo.pk } : {}),
					...(isNews ? { news: contentsId } : { board: contentsId }),
				};
				response = isNews
					? await createNewsReply(body as CreateNewsReplyRequest)
					: await createBoardReply(body as CreateBoardReplyRequest);
			}
			console.log('댓글 수정/등록', response);

			setContent('');
			if (inputRef.current) inputRef.current.innerHTML = '';
			setHasNewLine(false);
		} catch (error) {
			console.error('댓글 처리 중 오류', error);
			alert('댓글 처리 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(insertMentionIfNeeded, [replyTo, type]);
	useEffect(() => {
		if (type === 'edit' && defaultContent && inputRef.current) {
			inputRef.current.innerText = defaultContent;
			setContent(defaultContent);
		}
	}, [type, defaultContent]);

	return (
		<div
			className={
				type === 'comment' ? 'bg-black-200 rounded-[0.625rem] p-4 mb-10 flex flex-col gap-4 @mobile:h-53.5' : 'mt-5'
			}
		>
			{type === 'comment' && <h3 className="subtitle1-medium">댓글 쓰기</h3>}
			<div className="flex @mobile:flex-col h-full">
				<div
					className={clsx('relative w-full bg-black-000 rounded-[0.625rem] resize-none', {
						'pb-11.5': type !== 'comment' || !isMobile,
						'border border-black-200': type !== 'comment',
					})}
					style={{ height: `${inputHeight}px` }}
				>
					<div
						ref={inputRef}
						contentEditable
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						className={clsx(
							'p-4 pb-3 w-full h-full focus:outline-none body6-regular text-left overflow-y-scroll custom-scrollbar',
							{
								'empty-placeholder': content.trim().length === 0,
							},
						)}
						data-placeholder="욕설 및 유해한 내용의 댓글은 통보없이 삭제될 수 있습니다."
						suppressContentEditableWarning
					/>

					<div
						className={clsx(
							'flex gap-4 justify-end @mobile:mt-3',
							(type !== 'comment' || !isMobile) && 'absolute bottom-4 right-4',
						)}
					>
						{type !== 'comment' && (
							<button
								onClick={onCommentCancel}
								className="w-10.5 h-7 text-black-700 button5-medium rounded-[0.375rem] bg-black-300"
							>
								취소
							</button>
						)}
						<button
							onClick={() => {
								handleSubmit();
							}}
							disabled={isSubmitting || content.trim().length === 0}
							className={clsx(
								'w-10.5 h-7 text-black-000 button5-medium rounded-[0.375rem]',
								isSubmitting || content.trim().length === 0 ? 'bg-black-400' : 'bg-primary-900',
							)}
						>
							{type === 'edit' ? '수정' : '등록'}
						</button>
					</div>
				</div>
			</div>

			{isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
		</div>
	);
};

export default CommentInput;
