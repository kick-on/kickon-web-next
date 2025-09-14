'use client';

import Toolbar from './editor/tool-bar';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '@/lib/contexts/editor/context';

import AlertModal from '../detail/alert-modal';
import { compressImage } from '@/lib/utils';

const PostEditor = ({ setTitle, editedTitle }: { setTitle: (title: string) => void; editedTitle: string }) => {
	const { editor, showModal, pendingFile, setPendingFile, setShowModal, handleImageUpload } = useEditorContext();
	return (
		<>
			<input
				placeholder="제목"
				value={editedTitle ?? ''}
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Toolbar />
			<div className="w-full h-[460px] overflow-y-auto custom-scrollbar rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg border border-black-300">
				<EditorContent editor={editor} className="pl-4 p-3 w-full h-full focus:outline-none" />
			</div>
			{showModal && pendingFile && (
				<AlertModal
					type="confirm"
					description={'파일의 용량이 커 압축이 진행됩니다.\n계속하시겠습니까?'}
					onConfirm={async () => {
						const compressedFile = await compressImage(pendingFile);
						await handleImageUpload(compressedFile);
						setPendingFile(null);
						setShowModal(false);
					}}
					onCancel={() => {
						setPendingFile(null);
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
};
export default PostEditor;
