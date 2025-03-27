'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import FontFamily from '@tiptap/extension-font-family';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Toolbar from './tool-bar';

const PostEditor = ({ setTitle, setBody }: { setTitle: (title: string) => void; setBody: (body: string) => void }) => {
	const [linkUrl, setLinkUrl] = useState('');
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [showYoutubeInput, setShowYoutubeInput] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				autolink: false,
				openOnClick: true,
				defaultProtocol: 'https',
				protocols: ['http', 'https'],
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer',
					class: 'underline text-blue-500 cursor-pointer',
				},
			}),
			Image,
			Underline,
			FontFamily,
			HorizontalRule,
			Youtube,
		],
		content: '',
		editorProps: {
			attributes: {
				class: 'focus:outline-none',
			},
		},
		onUpdate: ({ editor }) => {
			const content = editor.getHTML().trim();

			// HTML 내부의 텍스트가 완전히 비어 있는지 확인!!
			const isEmpty = content === '' || content === '<p></p>' || content === '<p><br></p>';

			setBody(isEmpty ? '' : content);
		},
	});

	const handleHeadingChange = (value: string) => {
		if (value === 'paragraph') {
			editor?.chain().focus().setParagraph().run();
		} else {
			editor
				?.chain()
				.focus()
				.toggleHeading({ level: parseInt(value) as 1 | 2 | 3 })
				.run();
		}
	};

	const handleTextFormatToggle = (type: string) => {
		const chain = editor?.chain().focus();
		switch (type) {
			case 'bold':
				chain?.toggleBold().run();
				break;
			case 'italic':
				chain?.toggleItalic().run();
				break;
			case 'underline':
				chain?.toggleUnderline().run();
				break;
			case 'bulletList':
				chain?.toggleBulletList().run();
				break;
			case 'orderedList':
				chain?.toggleOrderedList().run();
				break;
			case 'blockquote':
				chain?.toggleBlockquote().run();
				break;
			case 'horizontalRule':
				chain?.setHorizontalRule().run();
				break;
			default:
				break;
		}
	};

	const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length) return;
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result) {
				editor
					?.chain()
					.focus()
					.setImage({ src: reader.result as string })
					.run();
			}
		};
		reader.readAsDataURL(file);
	};

	const handleInsertLink = () => {
		if (!linkUrl || !editor) return;
		editor?.chain().focus().setLink({ href: linkUrl }).run();
		setLinkUrl('');
		setShowLinkInput(false);
	};

	const handleInsertYoutube = () => {
		if (!youtubeUrl || !editor) return;
		const youtubeId = getYoutubeId(youtubeUrl);
		if (!youtubeId) {
			alert('유효한 유튜브 링크가 아닙니다.');
			return;
		}
		editor
			?.chain()
			.focus()
			.setYoutubeVideo({
				src: `https://www.youtube.com/watch?v=${youtubeId}`,
				width: 640,
				height: 360,
			})
			.run();
		setYoutubeUrl('');
		setShowYoutubeInput(false);
	};

	const getYoutubeId = (url: string) => {
		const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
		return match ? match[1] : null;
	};

	const toolbarProps = {
		editor,
		showLinkInput,
		setShowLinkInput,
		linkUrl,
		setLinkUrl,
		handleInsertLink,
		handleAddImage,
		handleTextFormatToggle,
		handleHeadingChange,
		showYoutubeInput,
		setShowYoutubeInput,
		youtubeUrl,
		setYoutubeUrl,
		handleInsertYoutube,
	};

	return (
		<div>
			<input
				placeholder="제목"
				className="title1-bold w-[39.75rem] h-[3.5rem] px-4 py-[15px] border border-[#D9D9D9] rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Toolbar {...toolbarProps} />
			<EditorContent
				editor={editor}
				className="tiptap rounded-lg overflow-y-auto minimal-scrollbar border border-[#D9D9D9] px-4 py-6 w-[636px] mb-7.5 h-[460px] focus:outline-none"
			/>
		</div>
	);
};

export default PostEditor;
