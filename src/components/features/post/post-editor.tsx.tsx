'use client';

import Toolbar from './editor/tool-bar';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '@/lib/contexts/editor/context';
import { EditorProvider } from '@/lib/contexts/editor/provider';
import AlertModal from '../detail/alert-modal';
import { compressImage } from '@/lib/utils';
import { useState } from 'react';

const EditorBody = () => {
	const { editor } = useEditorContext();
	return (
		<>
			<Toolbar />
			<div className="w-full h-[460px] overflow-y-auto custom-scrollbar rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg border border-black-300">
				<EditorContent editor={editor} className="pl-4 p-3 w-full h-full focus:outline-none" />
			</div>
		</>
	);
};

const ModalWrapper = ({
	pendingFile,
	setPendingFile,
	setShowModal,
}: {
	pendingFile: File;
	setPendingFile: (file: File | null) => void;
	setShowModal: (open: boolean) => void;
}) => {
	const { handleImageUpload } = useEditorContext();

	return (
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
	);
};

const PostEditor = ({
	setTitle,
	setBody,
	isNews,
	editedTitle,
	editedBody,
}: {
	setTitle: (title: string) => void;
	setBody: (body: string) => void;
	isNews: boolean;
	editedTitle: string;
	editedBody: string;
}) => {
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [showModal, setShowModal] = useState(false);
	return (
		<EditorProvider
			setBody={setBody}
			isNews={isNews}
			editedBody={editedBody}
			setPendingFile={setPendingFile}
			setShowModal={setShowModal}
		>
			<input
				placeholder="제목"
				value={editedTitle ?? ''}
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<EditorBody />
			{showModal && pendingFile && (
				<ModalWrapper pendingFile={pendingFile} setPendingFile={setPendingFile} setShowModal={setShowModal} />
			)}
		</EditorProvider>
	);
};
export default PostEditor;
