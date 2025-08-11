'use client';

import Toolbar from './editor/tool-bar';
import { EditorContent } from '@tiptap/react';
import { useEditorContext } from '@/lib/contexts/editor/context';
import { EditorProvider } from '@/lib/contexts/editor/provider';
import { useCallback, useEffect } from 'react';

const EditorBody = ({ onPasteEmbeddedLinks }: { onPasteEmbeddedLinks: (url: string) => void }) => {
	const { editor } = useEditorContext();

	const handlePasteEmbeddedLink = useCallback(
		// 복붙 이벤트가 발생하면 클립보드에서 텍스트 꺼냄
		(e: ClipboardEvent) => {
			const pastedText = e.clipboardData?.getData('text')?.trim() ?? '';

			if (!pastedText) return;

			// 텍스트 안에서 모든 URL 후보를 찾아서 처리
			const matches = pastedText.match(/https?:\/\/[^\s'"]+/g);
			if (!matches || matches.length === 0) {
				return;
			}

			matches.forEach((candidate) => {
				// 후보 끝에 붙는 불필요한 마침표나 괄호 같은 거 정리
				const cleaned = candidate.replace(/[),.?!]+$/g, '');
				try {
					const url = new URL(cleaned);
					console.log('[EditorBody] detected URL ->', url.href);
					onPasteEmbeddedLinks(url.href);
				} catch (err) {
					console.log('[EditorBody] invalid URL candidate:', cleaned, err);
				}
			});
		},
		[onPasteEmbeddedLinks],
	);

	useEffect(() => {
		if (!editor) return;

		// TipTap에서 이벤트를 막더라도 먼저 잡기 위해 document에 캡처 단계로 바인딩
		const handler = (e: ClipboardEvent) => {
			// 붙여넣기가 실제로 에디터 안에서 일어났는지 확인, document 전체에서 paste 이벤트를 듣고 있기 때문
			const target = e.target as Node;
			if (!editor.view.dom.contains(target)) return;
			handlePasteEmbeddedLink(e);
		};

		document.addEventListener('paste', handler, true);
		return () => {
			document.removeEventListener('paste', handler, true);
		};
	}, [editor, handlePasteEmbeddedLink]);

	return (
		<>
			<Toolbar />
			<div className="w-full h-[460px] overflow-y-auto custom-scrollbar rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg border border-black-300">
				<EditorContent editor={editor} className="pl-4 p-3 w-full h-full focus:outline-none" />
			</div>
		</>
	);
};

const PostEditor = ({
	setTitle,
	setBody,
	setOriginalEmbeddedLinks,
	isNews,
	editedTitle,
	editedBody,
}: {
	setTitle: (title: string) => void;
	setBody: (body: string) => void;
	setOriginalEmbeddedLinks: React.Dispatch<React.SetStateAction<string[]>>; // 배열 setter, 함수형 업데이트도 쓸 수 있게 Dispatch 타입 유지
	isNews: boolean;
	editedTitle: string;
	editedBody: string;
}) => {
	const handlePasteEmbeddedLinks = (url: string) => {
		setOriginalEmbeddedLinks((prevLinks) => [...new Set([...prevLinks, url])]); // paste 이벤트가 빠르게 여러 번 발생하는 경우 덮어씌워질 것을 방지해 함수형 업데이트
	};

	return (
		<EditorProvider setBody={setBody} isNews={isNews} editedBody={editedBody}>
			<input
				placeholder="제목"
				value={editedTitle ?? ''}
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<EditorBody onPasteEmbeddedLinks={handlePasteEmbeddedLinks} />
		</EditorProvider>
	);
};

export default PostEditor;
