import { useEditorContext } from '@/lib/contexts/editor/context';

const LinkInputModal = ({ onClose }) => {
	const { linkUrl, setLinkUrl, handleInsertLink } = useEditorContext();
	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
			<div className="flex flex-col items-center justify-center bg-black-000 p-6 rounded-lg w-[90%] max-w-sm">
				<h2 className="mb-6 body3-regular">링크를 삽입하세요.</h2>
				<input
					className="w-full p-2 border border-black-300 rounded-sm mb-4 outline-none"
					type="text"
					placeholder="URL을 입력하세요."
					value={linkUrl}
					onChange={(e) => setLinkUrl(e.target.value)}
				/>
				<div className="flex justify-end gap-4 button3-regular">
					<button onClick={onClose} className="px-3.5 py-2 border border-black-300 text-black-800 rounded-md">
						취소
					</button>
					<button
						onClick={() => {
							handleInsertLink();
							onClose();
							setLinkUrl('');
						}}
						disabled={!linkUrl}
						className={`px-3.5 py-2 rounded-md ${linkUrl ? 'bg-primary-900 text-white' : 'bg-gray-200 text-gray-500'}`}
					>
						저장
					</button>
				</div>
			</div>
		</div>
	);
};

export default LinkInputModal;
