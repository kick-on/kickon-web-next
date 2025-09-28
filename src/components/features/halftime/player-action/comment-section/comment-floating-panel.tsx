import Image from 'next/image';
import CommentContent from './comment-content';

export default function CommentFloatingPanel({ onClose }: { onClose: () => void }) {
	return (
		<div
			className="absolute w-[22.0625rem] max-h-[45.75rem] h-[70dvh] min-h-120 left-[4.875rem] bottom-0
				bg-black-000 rounded-lg shadow-calendar"
		>
			<CommentContent onClose={onClose} />
			<div
				className="absolute rotate-270 -left-5.5 bottom-50 z-20
					before:absolute before:-bottom-4 before:h-4 before:left-0 before:right-0
					before:bg-black-000 before:z-20"
			>
				<Image
					width={30}
					height={15}
					src={'/panel-arrow.svg'}
					alt="화살표"
					style={{
						filter: 'drop-shadow(-3px 0 4px rgba(0, 0, 0, 0.16))',
					}}
				/>
			</div>
		</div>
	);
}
