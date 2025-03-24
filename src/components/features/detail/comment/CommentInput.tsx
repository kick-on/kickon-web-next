import { useEffect, useRef, useState } from 'react';

interface CommentInputProps {
	type?: 'comment' | 'reply';
}

const CommentInput = ({ type = 'comment' }: CommentInputProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const thumbRef = useRef<HTMLDivElement>(null);
	const [scrollThumbHeight, setScrollThumbHeight] = useState(0);

	useEffect(() => {
		const textarea = textareaRef.current;
		const thumb = thumbRef.current;

		const updateScrollThumb = () => {
			if (!textarea || !thumb) return;

			const { scrollTop, scrollHeight, clientHeight } = textarea;

			// thumb 높이 비율 계산
			const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
			setScrollThumbHeight(thumbHeight);

			// thumb 위치 계산
			const scrollRatio = scrollTop / (scrollHeight - clientHeight);
			const thumbTop = scrollRatio * (clientHeight - thumbHeight);

			thumb.style.transform = `translateY(${thumbTop}px)`;
		};

		updateScrollThumb(); // 초기 설정
		textarea?.addEventListener('scroll', updateScrollThumb);
		window.addEventListener('resize', updateScrollThumb);

		return () => {
			textarea?.removeEventListener('scroll', updateScrollThumb);
			window.removeEventListener('resize', updateScrollThumb);
		};
	}, []);

	return (
		<div className={type === 'reply' ? 'mt-3.5' : 'bg-black-200 rounded-[10px] p-4 mb-10 flex flex-col gap-4'}>
			{type !== 'reply' && <h3 className="subtitle1-medium">댓글 쓰기</h3>}
			<div className={`flex gap-2 ${type === 'reply' ? 'h-20' : 'h-[104px]'}`}>
				<div className="relative w-full">
					<textarea
						ref={textareaRef}
						maxLength={1000}
						className={`w-full h-full p-4 pb-3 rounded-l-[10px] resize-none focus:outline-none overflow-y-scroll no-scrollbar body6-regular 
              ${type === 'reply' ? 'bg-black-100' : 'bg-black-000 h-full'}`}
						placeholder="댓글을 입력하세요"
					/>
				</div>

				{/* 커스텀 스크롤바 */}
				<div
					className={`relative w-[8px] rounded-md overflow-hidden ${type === 'reply' ? 'bg-black-200 h-20' : 'h-full'}`}
				>
					<div
						ref={thumbRef}
						className="absolute top-0 left-0 w-full bg-black-500 rounded-full"
						style={{ height: `${scrollThumbHeight}px` }}
					/>
				</div>

				{/* 등록 버튼 */}
				<button className="w-13.5 h-full bg-primary-900 border border-black-300 text-black-000 button3-regular rounded-r-[10px]">
					등록
				</button>
			</div>
		</div>
	);
};

export default CommentInput;
