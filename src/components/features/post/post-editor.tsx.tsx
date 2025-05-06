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
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import Toolbar from './tool-bar';

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
			Image.configure({
				HTMLAttributes: {
					class: 'responsive-image',
				},
			}),
			Underline,
			FontFamily,
			HorizontalRule,
			Youtube.configure({
				HTMLAttributes: {
					class: 'responsive-youtube',
				},
			}),
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

			// 이미지 삽입 후 빈 단락 추가하여 커서 위치시키기
			editor.chain().focus().createParagraphNear().run();

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
			})
			.createParagraphNear() // 커서 아래로 이동
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
				className="title1-bold @mobile:text-20 w-full @mobile:font-semibold h-[3.5rem] @mobile:h-12 px-4 py-[15px] @mobile:py-3 border border-black-300 rounded-lg mb-8 focus:outline-none"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Toolbar {...toolbarProps} />
			<div className="tiptap">
				<EditorContent
					editor={editor}
					className="rounded-lg @mobile:rounded-none @mobile:rounded-bl-lg @mobile:rounded-br-lg overflow-y-auto custom-scrollbar border border-black-300 px-4 py-6 w-full mb-7.5 h-[460px] focus:outline-none"
				/>
			</div>
		</div>
	);
};

export default PostEditor;

// 렌더링 시 처음은 ssr로 시작해서 모바일용 툴바부터 나오는 게 아닌 데스크탑용 툴바부터 나옴. 탭 선택하기도 마찬가지... 이를 어쩜 좋으니
