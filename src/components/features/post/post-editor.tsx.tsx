'use client';

import Toolbar from './editor/tool-bar';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '@/lib/contexts/editor/context';
import { EditorProvider } from '@/lib/contexts/editor/provider';

const EditorBody = () => {
	const { editor } = useEditorContext();
	return (
		<>
			<Toolbar />
			<div className="h-[460px] overflow-y-auto custom-scrollbar rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg border border-black-300 mb-7.5">
				<EditorContent editor={editor} className="pl-4 p-3 min-w-[311px] h-full focus:outline-none" />
			</div>
		</>
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
	return (
		<EditorProvider setBody={setBody} isNews={isNews} initialBody={editedBody}>
			<input
				placeholder="제목"
				value={editedTitle ?? ''}
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<EditorBody />
		</EditorProvider>
	);
};

export default PostEditor;
