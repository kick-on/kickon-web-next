'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { getPresignedUrl, uploadToS3 } from '@/services/apis/image-upload';
import { compressImage } from '@/lib/utils';

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

		// 로컬 미리보기 URL 먼저 보여주기
		const previewUrl = URL.createObjectURL(file);
		onChange(previewUrl);

		// orientation 판별 (미리보기 용)
		const img = document.createElement('img');
		img.src = previewUrl;
		img.onload = () => {
			setIsPortrait(img.height > img.width);
		};

		try {
			let fileToUpload = file;

			// 이미지가 5MB 이상일 때: alert 띄우고 확인되면 압축 진행
			if (file.size > 5 * 1024 * 1024) {
				const proceed = window.confirm(
					'선택하신 파일은 5MB 이상입니다.\n압축을 진행하며 시간이 다소 소요될 수 있습니다.\n계속하시겠습니까?',
				);
				if (!proceed) return;

				console.log(`압축 전 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
				fileToUpload = await compressImage(file);
				console.log(`압축 후 파일 크기: ${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`);
			}

			// presigned URL 발급
			const presignedResponse = await getPresignedUrl({
				type: 'news-files',
				fileName: fileToUpload.name || file.name,
			});

			const { presignedUrl, s3Url } = presignedResponse.data;

			// S3 업로드
			await uploadToS3(presignedUrl, fileToUpload);

			// 업로드 완료되면 미리보기 URL → s3Url로 교체
			onChange(s3Url);
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
						<Image src="/x/white.svg" alt="삭제 버튼" width={18} height={18} />
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
