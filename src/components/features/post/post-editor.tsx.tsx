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
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';

const PostEditor = ({
	setTitle,
	setBody,
	isNews,
}: {
	setTitle: (title: string) => void;
	setBody: (body: string) => void;
	isNews: boolean;
}) => {
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
			const html = editor.getHTML().trim();
			const text = editor
				.getText()
				.replace(/\u00A0/g, ' ')
				.trim(); // &nbsp; = \u00A0

			const isTrulyEmpty = text === ''; // 텍스트 기준으로 완전 공백인지 확인

			setBody(isTrulyEmpty ? '' : html);
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

	const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length || !editor) return;
		const file = event.target.files[0];

		try {
			// Presigned URL 요청
			const presignedResponse = await getPresignedUrl(file.name, isNews);
			const { presignedUrl, s3Url } = presignedResponse.data;

			console.log('S3 업로드 요청:', presignedResponse);

			// Presigned URL로 S3에 이미지 업로드
			await uploadToS3(presignedUrl, file);
			console.log('S3 업로드 완료:', s3Url);

			// 업로드된 이미지 URL을 에디터에 추가
			editor.chain().focus().setImage({ src: s3Url }).run();
			console.log('이미지 추가됨:', s3Url);

			// 에디터 내용 업데이트 (비동기 반영 확인)
			setTimeout(() => {
				const updatedContent = editor.getHTML();
				setBody(updatedContent);
				console.log('업데이트된 에디터 내용:', updatedContent);
			}, 100);
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
		}
	};

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleInsertLink = () => {
		if (!linkUrl || !editor) return;

		if (!isValidUrl(linkUrl)) {
			alert('유효한 링크를 입력해주세요.');
			return;
		}

		editor?.chain().focus().setLink({ href: linkUrl }).run();
		setLinkUrl('');
		setShowLinkInput(false);
	};

	const handleInsertYoutube = () => {
		if (!youtubeUrl || !editor) return;
		const youtubeId = getYoutubeId(youtubeUrl);
		if (!youtubeId) {
			alert('유효한 유튜브 링크를 입력해주세요.');
			return;
		}
		editor
			?.chain()
			.focus()
			.setYoutubeVideo({
				src: `https://www.youtube.com/watch?v=${youtubeId}`,
				width: 600,
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
			<div className="tiptap">
				<EditorContent
					editor={editor}
					className="rounded-lg overflow-y-auto minimal-scrollbar border border-[#D9D9D9] px-4 py-6 w-[636px] mb-7.5 h-[460px] focus:outline-none"
				/>
			</div>
		</div>
	);
};

export default PostEditor;
