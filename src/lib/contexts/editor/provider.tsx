'use client';

import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import FontFamily from '@tiptap/extension-font-family';
import { useEffect, useState } from 'react';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import { EditorContext } from './context';
import { Video } from '@/lib/extensions/video';
import PollExtension from '@/components/features/post/editor/poll-extension';

type EditorProviderProps = {
	children: React.ReactNode;
	setBody: (body: string) => void;
	isNews: boolean;
	editedBody: string;
};

export const EditorProvider = ({ children, setBody, isNews, editedBody }: EditorProviderProps) => {
	const [linkUrl, setLinkUrl] = useState('');
	const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [isYoutubeInputOpen, setIsYoutubeInputOpen] = useState(false);
	const [uploadingCount, setUploadingCount] = useState(0);
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [showModal, setShowModal] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			FontFamily,
			HorizontalRule,
			Video,
			Image.configure({ HTMLAttributes: { class: 'responsive-image' } }),
			Link.configure({
				autolink: false,
				openOnClick: true,
				defaultProtocol: 'https',
				HTMLAttributes: {
					target: '_blank',
					rel: 'noopener noreferrer',
					class: 'underline text-blue-500 cursor-pointer',
				},
			}),
			Youtube.configure({
				HTMLAttributes: {
					class: 'responsive-youtube iframe',
				},
			}),
			PollExtension,
		],
		content: editedBody || '',
		editorProps: {
			attributes: {
				class: 'focus:outline-none',
			},
			handleKeyDown(view, event) {
				// 엔터 키로 다음 단락 넘어가면 텍스트 포맷 초기화
				if (event.key === 'Enter') {
					const { state, dispatch } = view;
					const { tr } = state;

					const marksToRemove = ['bold', 'italic', 'underline'];

					marksToRemove.forEach((mark) => {
						const type = state.schema.marks[mark];
						if (type) {
							tr.removeStoredMark(type);
						}
					});

					dispatch(tr);
				}
				return false;
			},
		},
		onUpdate: ({ editor }) => {
			const html = editor.getHTML().trim();
			const text = editor
				.getText()
				.replace(/\u00A0/g, ' ')
				.trim();
			// 텍스트는 없어도 이미지나 영상 등 다른 노드가 있으면 내용이 있는 걸로 처리
			const isTrulyEmpty = text === '' && !/<img|video|iframe/.test(html);

			if (isTrulyEmpty) {
				// 본문 내용이 모두 지워지면 텍스트 포맷 초기화
				const { state, view } = editor;
				const { tr } = state;
				['bold', 'italic', 'underline'].forEach((mark) => {
					const type = state.schema.marks[mark];
					if (type) {
						tr.removeStoredMark(type);
					}
				});
				view.dispatch(tr);
				setBody('');
			} else {
				const normalizedHTML = html.trim();
				setBody(normalizedHTML);
			}
		},
	});

	useEffect(() => {
		if (editor && editor.isEditable && editedBody !== undefined && editedBody !== null) {
			// 현재 내용과 초기값이 다를 때만 설정
			if (editor.getHTML() !== editedBody) {
				editor.commands.setContent(editedBody, false);
			}
		}
	}, [editor, editedBody]);

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleHeadingChange = (value: string) => {
		if (!editor) return;
		if (value === 'paragraph') {
			editor.chain().focus().setParagraph().run();
		} else {
			editor
				.chain()
				.focus()
				.toggleHeading({ level: parseInt(value) as 1 | 2 | 3 })
				.run();
		}
	};

	const handleTextFormatToggle = (type: string) => {
		if (!editor) return;
		const chain = editor.chain().focus();
		switch (type) {
			case 'bold':
				chain.toggleBold().run();
				break;
			case 'italic':
				chain.toggleItalic().run();
				break;
			case 'underline':
				chain.toggleUnderline().run();
				break;
			case 'bulletList':
				chain.toggleBulletList().run();
				break;
			case 'orderedList':
				chain.toggleOrderedList().run();
				break;
			case 'blockquote':
				chain.toggleBlockquote().run();
				break;
			case 'horizontalRule':
				chain.setHorizontalRule().run();
				break;
		}
	};

	const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length || !editor) return;
		const file = event.target.files[0];

		// 파일 크기 확인
		if (file.size > 2 * 1024 * 1024) {
			// 용량이 큰 경우 -> 우선 모달만 띄움 (미리보기 X)
			setPendingFile(file);
			setShowModal(true);
			return;
		}

		const previewUrl = URL.createObjectURL(file);
		editor.chain().focus().setImage({ src: previewUrl }).run();
		// 작은 파일(<=2MB)은 바로 업로드 + 삽입
		await handleImageUpload(file);
	};

	const handleImageUpload = async (file: File) => {
		try {
			setUploadingCount((c) => c + 1); // 업로드 시작

			const presignedResponse = await getPresignedUrl({
				type: isNews ? 'news-files' : 'board-files',
				fileName: file.name,
			});

			const { presignedUrl, s3Url } = presignedResponse.data;
			await uploadToS3(presignedUrl, file);

			// 삽입된 미리보기 url -> S3 url로 교체
			editor.commands.updateAttributes('image', { src: s3Url });

			// 커서 위치 조정
			editor.chain().focus().createParagraphNear().run();

			// body 업데이트
			setTimeout(() => {
				const updatedContent = editor.getHTML();
				setBody(updatedContent);
			}, 100);
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
		} finally {
			setUploadingCount((c) => c - 1); // 업로드 종료
		}
	};

	const handleAddVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length || !editor) return;
		const file = event.target.files[0];

		try {
			// Presigned URL 요청
			const presignedResponse = await getPresignedUrl({
				type: isNews ? 'news-files' : 'board-files',
				fileName: file.name,
			});

			const { presignedUrl, s3Url } = presignedResponse.data;

			// S3에 업로드
			await uploadToS3(presignedUrl, file);

			// 에디터에 video 태그로 삽입
			editor
				.chain()
				.focus()
				.insertContent({
					type: 'video',
					attrs: { src: s3Url },
					preload: 'none',
					controls: true,
				})
				.run();

			editor.chain().focus().createParagraphNear().run();

			setTimeout(() => {
				const updatedContent = editor.getHTML();
				setBody(updatedContent);
			}, 100);
		} catch (error) {
			console.error('비디오 업로드 실패:', error);
		}
	};

	const handleInsertLink = () => {
		if (!editor || !linkUrl) return;
		if (!isValidUrl(linkUrl)) {
			alert('유효한 링크를 입력해주세요.');
			return;
		}
		editor
			.chain()
			.focus()
			.setLink({ href: linkUrl })
			.createParagraphNear() // 커서 아래로 이동
			.run();
		setLinkUrl('');
		setIsLinkInputOpen(false);
	};

	return (
		<EditorContext.Provider
			value={{
				editor,
				isLinkInputOpen,
				setIsLinkInputOpen,
				linkUrl,
				setLinkUrl,
				handleInsertLink,
				handleAddImage,
				handleTextFormatToggle,
				handleHeadingChange,
				isYoutubeInputOpen,
				setIsYoutubeInputOpen,
				youtubeUrl,
				setYoutubeUrl,
				handleAddVideo,
				handleImageUpload,
				uploadingCount,
				pendingFile,
				showModal,
				setPendingFile,
				setShowModal,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
};
