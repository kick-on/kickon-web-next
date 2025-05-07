import { useEffect, useRef } from 'react';
import { useEditorContext } from '@/lib/contexts/editor/context';

const LinkInputModal = ({ onClose }) => {
	const { linkUrl, setLinkUrl, handleInsertLink } = useEditorContext();
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			inputRef.current?.focus();
		}, 100); // 약간 딜레이 주는 것이 모바일에서 더 잘 작동함

		return () => clearTimeout(timer);
	}, []);

	// 배경 클릭 시 닫힘
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div onClick={handleBackdropClick} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
			<div
				onClick={(e) => e.stopPropagation()} // 내부 클릭은 전파 방지
				className="flex flex-col items-center justify-center bg-black-000 px-4 py-6 gap-5 rounded-lg w-77.75 h-48"
			>
				<h2 className="body3-regular">링크를 입력해 주세요.</h2>
				<input
					ref={inputRef}
					className="w-full p-2 bg-black-100 border border-black-200 rounded-[0.375rem] outline-none"
					type="text"
					value={linkUrl}
					onChange={(e) => setLinkUrl(e.target.value)}
				/>
				<div className="flex justify-end gap-4 button3-semibold">
					<button onClick={onClose} className="px-4 py-2.5 bg-black-200 text-black-700 rounded-md">
						취소
					</button>
					<button
						onClick={() => {
							handleInsertLink();
							onClose();
							setLinkUrl('');
						}}
						disabled={!linkUrl}
						className={`px-4 py-2.5 rounded-md ${linkUrl ? 'bg-primary-900 text-white' : 'bg-gray-200 text-gray-500'}`}
					>
						확인
					</button>
				</div>
			</div>
		</div>
	);
};

export default LinkInputModal;
