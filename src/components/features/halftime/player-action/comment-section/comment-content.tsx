import Image from 'next/image';

export default function CommentContent({
	onClose,
	onDragStart,
	onDragEnd,
}: {
	onClose: () => void;
	onDragStart?: (e: React.TouchEvent | React.DragEvent) => void;
	onDragEnd?: (e: React.TouchEvent | React.DragEvent) => void;
}) {
	return (
		<div className="h-full rounded-[0.625rem] grid grid-rows-[auto_1fr_auto] overflow-hidden">
			<section
				className="p-4 w-full bg-black-000 flex items-center justify-between border-b border-black-200"
				style={{ filter: 'drop-shadow(0 -14px 12px rgba(0, 0, 0, 0.20))' }}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onTouchStart={onDragStart}
				onTouchEnd={onDragEnd}
			>
				<div className="text-title-05">
					댓글&nbsp;
					<span className="text-black-600 text-subtitle-01">14</span>
				</div>
				<button className="w-6 h-6 flex justify-center items-center" onClick={onClose}>
					<Image src={'/x/white.svg'} alt="닫기" width={24} height={24} className="w-6 h-6" />
				</button>
			</section>

			<section className="h-full halftime-comment-scrollbar">
				{new Array(10).fill(null).map((_, i) => (
					<div key={i} className="h-30 border"></div>
				))}
			</section>

			<section className="w-full h-28">댓글 input</section>
		</div>
	);
}
