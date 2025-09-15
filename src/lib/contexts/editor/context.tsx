'use client';

import { createContext, useContext } from 'react';
import { Editor } from '@tiptap/react';

interface EditorContextProps {
	editor: Editor | null;
	isLinkInputOpen: boolean;
	setIsLinkInputOpen: (val: boolean) => void;
	linkUrl: string;
	setLinkUrl: (val: string) => void;
	handleInsertLink: () => void;

	isYoutubeInputOpen: boolean;
	setIsYoutubeInputOpen: (val: boolean) => void;
	youtubeUrl: string;
	setYoutubeUrl: (val: string) => void;

	handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleTextFormatToggle: (type: string) => void;
	handleHeadingChange: (value: string) => void;
	handleAddVideo: (e: React.ChangeEvent<HTMLInputElement>) => void;

	handleImageUpload: (file: File) => Promise<void>;
	uploadingCount: number;
	pendingFile: File;
	showModal: boolean;
	setPendingFile: React.Dispatch<React.SetStateAction<File | null>>;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditorContext = createContext<EditorContextProps | null>(null);

export const useEditorContext = () => {
	const ctx = useContext(EditorContext);
	if (!ctx) throw new Error('useEditorContext는 EditorProvider 내부에서만 사용 가능합니다.');
	return ctx;
};
