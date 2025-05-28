'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';

interface ThumbnailUploaderProps {
	selectedImage: string | null;
	onChange: (url: string | null) => void;
}

export default function ThumbnailUploader({ selectedImage, onChange }: ThumbnailUploaderProps) {
	const [isPortrait, setIsPortrait] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const img = document.createElement('img');
			img.src = URL.createObjectURL(file);
			img.onload = async () => {
				setIsPortrait(img.height > img.width);

				const presignedResponse = await getPresignedUrl({
					type: 'news-files',
					fileName: file.name,
				});

				const { presignedUrl, s3Url } = presignedResponse.data;

				await uploadToS3(presignedUrl, file);
				onChange(s3Url);
			};
		} catch (error) {
			console.error('파일 업로드 실패:', error);
		}
	};

	const handleRemoveImage = () => {
		onChange(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<>
			{selectedImage ? (
				<div className="relative w-full h-80.5 @mobile:h-47.5 mb-4 bg-black-200 rounded-[10px] overflow-hidden flex items-center justify-center">
					<Image
						src={selectedImage}
						alt="업로드된 대표 이미지"
						layout="fill"
						objectFit={isPortrait ? 'contain' : 'cover'}
						className="rounded-[10px]"
					/>
					<button
						onClick={handleRemoveImage}
						className={clsx('absolute top-2 right-2 p-1 rounded-full', isPortrait ? 'bg-black-300' : 'bg-black-200')}
					>
						<Image src="/x.svg" alt="삭제 버튼" width={18} height={18} />
					</button>
				</div>
			) : (
				<div
					className="flex items-center gap-2 cursor-pointer button4-medium text-black-600 mb-7.5"
					onClick={handleImageClick}
				>
					<Image src="/image.svg" width={20} height={20} alt="앨범 아이콘" />
					대표 이미지 추가
				</div>
			)}
			<input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
		</>
	);
}
