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

	useEffect(() => {
		if (type === 'comment') {
			setInputHeight(isMobile ? 110 : 104);
		} else {
			setInputHeight(isMobile ? 92 : 102);
		}
	}, [isMobile, type]);

	// 입력 이벤트 처리
	const handleInput = () => {
		if (!inputRef.current) return;

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

		const inputText = inputRef.current.innerText.trim();
		setContent(inputText);
	};

	// 댓글 등록
	const handleSubmit = async () => {
		if (!currentUserInfo) {
			setIsLoginModalOpen(true);
			return;
		}
		if (!content.trim()) {
			alert('내용을 입력해주세요!');
			return;
		}
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			let response;
			const isNews = contentType === 'news';
			const sanitizedContent = content.replace(/\u200B/g, '');

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

			if (inputRef.current) inputRef.current.innerHTML = '';
			setContent('');
			onCommentSubmit();
		} catch (error) {
			console.error('댓글 처리 중 오류', error);
			alert('댓글 처리 중 오류가 발생했습니다.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// 멘션 뒤로 커서 이동
	const handleFocus = () => {
		if (!inputRef.current || !isReply) return;
		inputRef.current.innerHTML = '\u200B'; // zero-width space 추가
	};

	useEffect(() => {
		if (!inputRef.current) return;

		if (type === 'reply') {
			inputRef.current.focus(); // 자동 포커싱
		}
		if (type === 'edit' && defaultContent) {
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
						onFocus={handleFocus}
						onInput={handleInput}
						className={clsx(
							'p-4 pb-3 w-full h-full focus:outline-none body6-regular text-left overflow-y-scroll custom-scrollbar before:pointer-events-none before:select-none',
							{
								'before:content-[attr(data-mention)] before:text-primary-900 before:pr-1': isReply,
								'before:content-[attr(data-placeholder)] before:text-black-600':
									!isReply && content.trim().length === 0,
							},
						)}
						data-mention={isReply ? `@${replyTo.nickname}` + ' ' : undefined}
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
