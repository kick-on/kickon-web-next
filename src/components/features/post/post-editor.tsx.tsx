'use client';

import Toolbar from './tool-bar';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '@/lib/contexts/editor/context';
import { EditorProvider } from '@/lib/contexts/editor/provider';

const EditorBody = () => {
	const { editor } = useEditorContext();
	return (
		<>
			<Toolbar />
			<EditorContent
				editor={editor}
				className="rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg overflow-y-auto custom-scrollbar border border-black-300 px-4 py-6 w-full mb-7.5 h-[460px] focus:outline-none"
			/>
		</>
	);
};

const PostEditor = ({
	setTitle,
	setBody,
	isNews,
}: {
	setTitle: (title: string) => void;
	setBody: (body: string) => void;
	isNews: boolean;
}) => {
	return (
		<EditorProvider setBody={setBody} isNews={isNews}>
			<input
				placeholder="제목"
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<EditorBody />
		</EditorProvider>
	);
};

export default PostEditor;
