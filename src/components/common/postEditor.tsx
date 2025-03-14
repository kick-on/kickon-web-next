'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import YouTube from '@tiptap/extension-youtube';
import { BiLinkAlt, BiImageAlt, BiVideo } from 'react-icons/bi';
import ImageIcon from 'next/image';
import clsx from 'clsx';

const headingOptions = [
	{ label: '제목', value: 'paragraph' },
	{ label: '부제목', value: '1' },
	{ label: '소제목', value: '2' },
	{ label: '본문', value: '3' },
];

const PostEditor = () => {
	const [linkUrl, setLinkUrl] = useState('');
	const [youtubeUrl, setYoutubeUrl] = useState('');
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [showYoutubeInput, setShowYoutubeInput] = useState(false);
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [selectedOption, setSelectedOption] = useState(headingOptions[0]);
	const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
	const dropdownRef = useRef<HTMLDivElement>(null);

	const editor = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
				alignments: ['left', 'center', 'right'],
			}),
			Link.configure({ openOnClick: false }),
			Image,
			Underline,
			TextStyle,
			FontFamily,
			BulletList,
			ListItem,
			YouTube.configure({ controls: true }),
		],
		content: '',
		editorProps: {
			attributes: {
				class: 'focus:outline-none caret-red-500',
			},
		},
	});

	const handleAlignClick = () => {
		if (alignment === 'left') {
			setAlignment('center');
			editor?.chain().focus().setTextAlign('center').run();
		} else if (alignment === 'center') {
			setAlignment('right');
			editor?.chain().focus().setTextAlign('right').run();
		} else {
			setAlignment('left');
			editor?.chain().focus().setTextAlign('left').run();
		}
	};
	const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
	const addYoutubeVideo = useCallback(() => {
		if (!youtubeUrl) return;
		editor?.commands.setYoutubeVideo({ src: youtubeUrl });
		setYoutubeUrl('');
		setShowYoutubeInput(false);
	}, [editor, youtubeUrl]);

	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleOptionClick = (option: { label: string; value: string }) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);

		if (option.value === 'paragraph') {
			editor?.chain().focus().setParagraph().run();
		} else {
			editor
				?.chain()
				.focus()
				.toggleHeading({ level: parseInt(option.value) as 1 | 2 | 3 })
				.run();
		}
	};

	// 드롭다운 외부 클릭 시 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	if (!editor) {
		return null;
	}

	const buttons = [
		{ text: '취소', color: 'text-black-700', variant: 'bg-black-200', onClick: () => console.log('취소') },
		{ text: '작성 완료', color: 'text-black-100', variant: 'bg-primary-900', onClick: () => console.log('완료') },
	];

	return (
		<div>
			<div>
				<input
					placeholder="제목"
					className="title2-semibold w-[636px] px-4 py-[15px]  border border-[#D9D9D9] rounded-lg mb-8 focus:outline-none caret-red-500"
				/>
				<div className="flex flex-wrap items-center gap-2 pb-4">
					{/* 제목 스타일 드롭다운 */}
					<div ref={dropdownRef} className="relative w-fit">
						<button
							onClick={handleDropdownToggle}
							className="flex items-center gap-1.5 px-2 py-[9px] border border-[#D9D9D9] rounded-sm"
						>
							<div className="text-[#8C8C8C] body5-regular">{selectedOption.label}</div>
							<ImageIcon width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
						</button>
						{isVisibleDropdown && (
							<div className="z-50 absolute top-10 w-[63px] bg-white border border-gray-300 rounded-sm shadow-sm">
								{headingOptions.map((option, index) => (
									<div
										key={option.value}
										className={clsx('p-2 body5-regular cursor-pointer hover:bg-gray-200 transition-colors', {
											'rounded-t-sm': index === 0,
											'rounded-b-sm': index === headingOptions.length - 1,
										})}
										onClick={() => handleOptionClick(option)}
									>
										{option.label}
									</div>
								))}
							</div>
						)}
					</div>
					<div className="text-[#E0E0E0] px-2"> | </div>

					{/* 스타일 버튼 */}
					<div className="flex gap-2 border border-[#D9D9D9] text-[#8C8C8C] rounded-sm px-2 py-[7px]">
						<button
							className={`${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
							onClick={() => editor.chain().focus().toggleBold().run()}
						>
							B
						</button>
						<button
							className={`${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
							onClick={() => editor.chain().focus().toggleUnderline().run()}
						>
							U
						</button>
						<button
							className={`${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
							onClick={() => editor.chain().focus().toggleItalic().run()}
						>
							I
						</button>
						<button
							className={`${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
							onClick={() => editor.chain().focus().toggleBulletList().run()}
						>
							•
						</button>
					</div>

					{/* 텍스트 정렬 버튼 */}
					<div className="flex gap-2">
						<button className="p-2 border rounded-md" onClick={handleAlignClick}>
							{alignment === 'left' && '1'}
							{alignment === 'center' && '2'}
							{alignment === 'right' && '3'}
						</button>
					</div>

					{/* 링크, 이미지, 동영상 버튼 */}
					<div className="flex gap-2">
						<button
							className="p-[7px] border border-[#D9D9D9] rounded-sm"
							onClick={() => setShowLinkInput(!showLinkInput)}
						>
							<BiLinkAlt />
						</button>
						<label className="cursor-pointer p-[7px] border border-[#D9D9D9] rounded-sm">
							<BiImageAlt />
							<input type="file" accept="image/*" className="hidden" onChange={addImage} />
						</label>
						<button
							className="p-[7px] border border-[#D9D9D9] rounded-sm"
							onClick={() => setShowYoutubeInput(!showYoutubeInput)}
						>
							<BiVideo />
						</button>
					</div>
				</div>

				{/* 입력 폼 */}
				{showLinkInput && (
					<div className="p-3 bg-gray-200 flex gap-2">
						<input
							className="flex-1 p-1 border rounded-md"
							type="text"
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
							placeholder="https://example.com"
						/>
						<button className="p-1 border rounded-md bg-white">저장</button>
						<button className="p-1 border rounded-md bg-white" onClick={() => setShowLinkInput(false)}>
							취소
						</button>
					</div>
				)}
				{showYoutubeInput && (
					<div className="p-3 bg-gray-200 flex gap-2">
						<input
							className="flex-1 p-1 border rounded-md"
							type="text"
							value={youtubeUrl}
							onChange={(e) => setYoutubeUrl(e.target.value)}
							placeholder="유튜브 URL"
						/>
						<button className="p-1 border rounded-md bg-white" onClick={addYoutubeVideo}>
							저장
						</button>
						<button className="p-1 border rounded-md bg-white" onClick={() => setShowYoutubeInput(false)}>
							취소
						</button>
					</div>
				)}
			</div>
			<EditorContent
				editor={editor}
				className="rounded-lg overflow-hidden border border-[#D9D9D9] px-4 py-6 w-[636px] mb-7.5 h-[460px] focus:outline-none"
			/>
			<div className="flex justify-center gap-4 mt-4">
				{buttons.map(({ text, color, variant, onClick }) => (
					<button
						key={text}
						onClick={onClick}
						className={`w-[164px] button2-semibold px-4 py-2 ${color} rounded-lg ${variant}`}
					>
						{text}
					</button>
				))}
			</div>
		</div>
	);
};

export default PostEditor;
